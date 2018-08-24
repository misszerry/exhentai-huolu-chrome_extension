'use strict';
/* data fields */
let transSwitch; // 翻譯開關
let highLightSwitch; // 標亮開關
let time; // 歷史讀到的最新時間
let readTime; // 本頁最新時間
let maxTime;
let minTime;
let exclude_tag_list;
let exclude_uploader_list;
const as = document.querySelectorAll("div.id3 a");
/* main program */
//全體開關
chrome.storage.sync.get(null,
    (list) => {
        const run = list.run;
        //選擇使用的時間
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
            exclude_uploader_list = list.Uploaders;
            init();
        }
    });

async function init() {
    //Loading視覺化
    addLoader();

    //取得各gallery的gid與token
    let all_request_data = [];
    as.forEach(e => {
        const gid = e.href.split("/")[4];
        const token = e.href.split("/")[5];
        all_request_data.push([gid, token])
    });
    const gdata = {
        tags: [],
        uploaders: [],
        postedTime: []
    };
    while (all_request_data.length > 0) {
        let req_data;
        if (all_request_data.length > 25) {
            req_data = all_request_data.slice(0, 25)
            all_request_data.splice(0, 25);
        } else {
            req_data = all_request_data;
            all_request_data = []
        }
        const res = await getGalleryData(req_data);
        gdata.tags = gdata.tags.concat(res.tags);
        gdata.uploaders = gdata.uploaders.concat(res.uploaders);
        gdata.postedTime = gdata.postedTime.concat(res.postedTime);
    }
    // render page
    render(gdata)
}

//render主程式
function render(gdata) {
    const divs = document.querySelectorAll("div.id1");
    const galleryTitle = document.querySelectorAll("div.id2 a");

    const tags = gdata.tags;
    const uploaders = gdata.uploaders;
    const postedTime = gdata.postedTime;
    maxTime = postedTime[0];
    minTime = postedTime[0];

    click_event_delegrat();
    //設定浮動視窗
    for (let i = 0; i < tags.length; i++) {
        //調整checkbox
        const checkbox = divs[i].querySelector('[name="modifygids[]"]');
        if(checkbox){
            checkbox.style.zIndex = 1;
        }
        //小圖標
        let flaged = false;
        //新增card父元素
        const card = addCard(divs[i]);
        //新增背後tag顯示視窗
        const tagDisplay = addTagDisplay(card);
        //style
        tagDisplay.style.maxHeight = parseInt(divs[i].style.height) + 5 + "px";

        //新增按鈕
        const switchBtn = addTagSwitch(card)

        //內容文字
        if (tags[i].length === 0) {
            tagDisplay.innerHTML += `<span class='tagspan'>${i18n.no_tag}</span>`;
        }
        let tagType = "";
        //未讀標亮
        if (postedTime[i] > maxTime) {
            maxTime = postedTime[i];
        }
        if (postedTime[i] < minTime) {
            minTime = postedTime[i];
        }
        if (highLightSwitch && postedTime[i] > time) {
            as[i].style.color = "#FF2D2D";
            divs[i].style.color = "#FF2D2D";
            galleryTitle[i].style.color = "#FF2D2D";
            divs[i].style.background = "#FFFFAA";
        }
        const tagsCount = tags[i].length;
        const tag_fragment = document.createDocumentFragment();
        for (let j = 0; j < tagsCount; j++) {
            const splited_tag_array = tags[i][j].split(":");
            const tag = {
                "type":splited_tag_array[splited_tag_array.length-2],
                "name":splited_tag_array[splited_tag_array.length-1]
            };
            //語言小圖標
            if (lanIcon[tags[i][j]]) {
                flaged = true;
                galleryTitle[i].innerHTML = `<img src='${lanIcon[tags[i][j]]}'>${galleryTitle[i].innerHTML}`;
            }
            //控制tag種類換行
            if (tag.type != tagType && j != 0) {
                let nextLine = document.createElement("br");
                tag_fragment.appendChild(nextLine);
            }
            tagType = tag.type;
            //屏蔽
            if(!divs[i].classList.contains("rotate-180")){
                if(exclude_uploader_list.includes(uploaders[i])){
                    switchBtn.click();

                    const btn = document.createElement('div');
                    btn.innerHTML = `${i18n.block_warning}<p class="field-span">Uploader : ${uploaders[i]}</p>${i18n.block_confirm}`;
                    btn.classList.add("field-btn");
                    btn.addEventListener('click', function () {
                        this.remove();
                    });
                    card.appendChild(btn);
                }else if(exclude_tag_list.includes(tag.name)){
                    switchBtn.click();

                    const btn = document.createElement('div');
                    btn.innerHTML = `${i18n.block_warning}<p class="field-span">tag : ${tag.name}</p>${i18n.block_confirm}`;
                    btn.classList.add("field-btn");
                    btn.addEventListener('click', function () {
                        this.remove();
                    });
                    card.appendChild(btn);
                }
            }
            //翻譯
            tag.name = transSwitch && tData[tag.name] ?  tData[tag.name] : tag.name;
            //創建tag span
            const lastSpan = document.createElement("span");
            lastSpan.textContent = tag.name;
            lastSpan.classList.add("tagspan");
            lastSpan.style.backgroundColor = tagcolors[tag.type] || "gray";
            tag_fragment.appendChild(lastSpan);
        }
        tagDisplay.appendChild(tag_fragment);
        //預設日文圖標
        if (!flaged && !tags[i].includes("language:translated")) {
            galleryTitle[i].innerHTML = `<img src='${lanIcon.jp}'> ${galleryTitle[i].innerHTML}`;
        }
    }
    if (maxTime > readTime) {
        readTime = maxTime;
    }
    //記憶最後閱讀畫廊之時間
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
    //移除load
    document.getElementById('load').remove();
}
//fetch e-h api
function getGalleryData(data) {
    if (data.length > 0) {
        return fetch("https://api.e-hentai.org/api.php", {
                method: 'POST',
                body: JSON.stringify({
                    "method": "gdata",
                    "gidlist": data,
                    "namespace": 1
                })
            })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                const tags = [];
                const uploaders = [];
                const postedTime = [];
                data.gmetadata.forEach(e => {
                    postedTime.push(e.posted);
                    tags.push(e.tags);
                    uploaders.push(e.uploader);
                });
                return {
                    tags,
                    uploaders,
                    postedTime
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
}