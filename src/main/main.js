"use strict";
/* switch */
let transSwitch; // 翻譯開關
let highLightSwitch; // 標亮開關
let low_size; //低容量警示標籤開關 
/* data fields */
let time; // 歷史讀到的最新時間 time saved in storage
let readTime; // 本頁最新時間 time of this page
let maxTime;
let minTime;
let exclude_tag_list;
let exclude_uploader_list;
let white_tag_list;
let white_uploader_list;
const as = document.querySelectorAll("div.id3 a");
/* main program */
chrome.runtime.sendMessage({
    "message": "active"
});
//全體開關
chrome.storage.sync.get(null,
    (list) => {
        const run = list.run;
        // get the correct time to use
        if (location.href.match("exhentai")) {
            time = list.exLastViewTime;
            readTime = list.exReadTime;
        } else if (location.href.match("e-hentai")) {
            time = list.eLastViewTime;
            readTime = list.eReadTime;
        }
        if (run) {
            transSwitch = list.trans;
            highLightSwitch = list.highLightSwitch;
            exclude_tag_list = list.tags;
            exclude_uploader_list = list.uploaders;
            white_tag_list = list["whitelist-tags"];
            white_uploader_list = list["whitelist-uploaders"];
            low_size = list.low_size;
            init();
        }
    });

async function init() {
    //Loader
    addLoader();

    //get gid & token
    let all_request_data = getRequestDataFromPage(as);

    const gdata = {
        tags: [],
        uploaders: [],
        postedTime: [],
        filecount: [],
        filesize: []
    };
    while (all_request_data.length > 0) {
        let req_data;
        if (all_request_data.length > 25) {
            req_data = all_request_data.slice(0, 25);
            all_request_data.splice(0, 25);
        } else {
            req_data = all_request_data;
            all_request_data = [];
        }
        const {tags,uploaders,postedTime,filecount,filesize} = await getGalleryData(req_data);
        gdata.tags = [...gdata.tags, ...tags];
        gdata.uploaders = [...gdata.uploaders, ...uploaders];
        gdata.postedTime = [...gdata.postedTime, ...postedTime];
        gdata.filesize = [...gdata.filesize, ...filesize];
        gdata.filecount = [...gdata.filecount, ...filecount];
    }
    // render page
    render(gdata);
}

//render
function render({tags,uploaders,postedTime,filecount,filesize}) {
    const divs = document.querySelectorAll("div.id1");
    const galleryTitle = document.querySelectorAll("div.id2 a");

    maxTime = postedTime[0];
    minTime = postedTime[0];

    click_event_delegate();
    // set up display
    for (let i = 0; i < tags.length; i++) {
        // check if in whitelist
        const isWhiteTag = tags[i].filter((tag)=>{
            const split_tag_array = tag.split(":");
            return white_tag_list.includes(split_tag_array[split_tag_array.length - 1]);
        }).length > 0;
        const isWhiteUploader = uploaders.filter((uploader)=>white_uploader_list.includes(uploader)).length > 0;
        const isWhite = isWhiteTag || isWhiteUploader;
        // fix checkbox
        const checkbox = divs[i].querySelector("[name='modifygids[]']");
        if (checkbox) {
            checkbox.style.zIndex = 1;
        }
        // language flag icon
        let flagged = false;
        // add card as parent div
        const card = addCard(divs[i]);
        // add display to the card back side
        const tagDisplay = addTagDisplay(card);

        // add a switch button
        const switchBtn = addTagSwitch(card);

        let tagType = "";
        // highlight
        maxTime = postedTime[i] > maxTime ? postedTime[i] : maxTime;
        minTime = postedTime[i] < minTime ? postedTime[i] : minTime;

        if (highLightSwitch && postedTime[i] > time) {
            divs[i].classList.add("highlight");
        }
        // low size tag setup
        if (low_size.isOn && filesize[i] / 1048576 / filecount[i] < low_size.size) {
            divs[i].setAttribute("data-uploader", `${i18n.low_size}\n${uploaders[i]}`);
            divs[i].classList.add("low_size");
        }
        const tagsCount = tags[i].length;
        const tag_fragment = document.createDocumentFragment();
        // if no tag , add a no_tag tag into display
        if (tagsCount === 0) {
            tagDisplay.innerHTML += `<span class='tagspan'>${i18n.no_tag}</span>`;
            continue;
        }
        for (let j = 0; j < tagsCount; j++) {
            const split_tag_array = tags[i][j].split(":");
            const tag = {
                "type": split_tag_array[split_tag_array.length - 2],
                "name": split_tag_array[split_tag_array.length - 1]
            };
            // language icon
            if (lanIcon[tags[i][j]]) {
                const flagImage = document.createElement("img");
                flagImage.setAttribute("src",lanIcon[tags[i][j]]);
                flagged = true;
                galleryTitle[i].insertAdjacentElement("afterbegin",flagImage);
            }
            // next line if tag type change
            if (tag.type != tagType && j != 0) {
                let nextLine = document.createElement("br");
                tag_fragment.appendChild(nextLine);
            }
            tagType = tag.type;
            /////////////////////////////
            /* block gallery function */
            if (!isWhite && !divs[i].classList.contains("rotate-180")) {
                if (exclude_uploader_list.includes(uploaders[i])) {
                    switchBtn.click();

                    const btn = document.createElement("div");
                    btn.innerHTML = `${i18n.block_warning}<p class="field-span">Uploader : ${uploaders[i]}</p>${i18n.block_confirm}`;
                    btn.classList.add("field-btn");
                    btn.addEventListener("click", function () {
                        this.remove();
                    });
                    card.appendChild(btn);
                } else if (exclude_tag_list.includes(tag.name)) {
                    switchBtn.click();

                    const btn = document.createElement("div");
                    btn.innerHTML = `${i18n.block_warning}<p class="field-span">tag : ${tag.name}</p>${i18n.block_confirm}`;
                    btn.classList.add("field-btn");
                    btn.addEventListener("click", function () {
                        this.remove();
                    });
                    card.appendChild(btn);
                }
            }
            /////////////////////////////
            // translate
            tag.name = transSwitch && tData[tag.name] ? tData[tag.name] : tag.name;
            // add tag span
            const lastSpan = document.createElement("span");
            lastSpan.textContent = tag.name;
            lastSpan.classList.add("tagspan");
            lastSpan.style.backgroundColor = tagcolors[tag.type] || "gray";
            tag_fragment.appendChild(lastSpan);
        }
        tagDisplay.appendChild(tag_fragment);
        // default icon to JP if no language translated tag
        if (!flagged && !tags[i].includes("language:translated")) {
            const flagImage = document.createElement("img");
            flagImage.setAttribute("src",lanIcon.jp);
            galleryTitle[i].insertAdjacentElement("afterbegin",flagImage);
        }
    }
    readTime = maxTime > readTime ? maxTime : readTime;
    // set time
    if (location.href.match("exhentai")) {
        if (minTime < time && readTime > time) {
            chrome.storage.sync.set({
                exLastViewTime: readTime,
                exReadTime: readTime
            });
        } else {
            chrome.storage.sync.set({
                exReadTime: readTime
            });
        }
    } else if (location.href.match("e-hentai")) {
        if (minTime < time && readTime > time) {
            chrome.storage.sync.set({
                eLastViewTime: readTime,
                eReadTime: readTime
            });
        } else {
            chrome.storage.sync.set({
                eReadTime: readTime
            });
        }
    }
    //remove loader
    document.getElementById("load").remove();
}