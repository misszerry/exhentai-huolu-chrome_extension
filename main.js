/* data fields */
let transSwitch; // 翻譯開關
let highLightSwitch; // 標亮開關
let fielded = true;
let time; // 歷史讀到的最新時間
let readTime; // 本頁最新時間
let maxTime;
let minTime;
const galleryList = document.querySelector(".itg");
const divs = document.querySelectorAll("div.id1"); 
const divs2 = document.querySelectorAll("div.id2"); 
const divs3 = document.querySelectorAll("div.id3"); 
const divs4 = document.querySelectorAll("div.id4"); 
const galleryTitle = document.querySelectorAll("div.id2 a"); 
const as = document.querySelectorAll("div.id3 a"); 
const gdata = [];
const image = document.querySelectorAll("div.id3 a img"); 
const tags = [];
const uploaders = [];
const postedTime = [];
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
            document.removeEventListener("click", event);
            init()
        }
    });

async function init() {
    //Loading視覺化
    const load = document.createElement("div");
    const loader = document.createElement("div");
    const loadText = document.createElement("p");
    loadText.textContent = "活路載入中";
    load.classList.add("load");
    loader.classList.add("loader");
    load.appendChild(loadText);
    load.appendChild(loader);
    document.body.appendChild(load);

    //取得各gallery的gid與token
    as.forEach(e => {
        const gid = e.href.split("/")[4];
        const token = e.href.split("/")[5];
        gdata.push([gid,token])
    });
    while(gdata.length>25){
        await getGalleryData(gdata.slice(0,25));
        gdata.splice(0,25);
    }
    await getGalleryData(gdata);
    render()
}

//繼續主程式
function render() {
    maxTime = postedTime[0];
    minTime = postedTime[0];
    //設定浮動視窗
    const tagsLength = tags.length;
    for (let i = 0; i < tagsLength; i++) {
        let flaged = false;
        //新增視窗
        let tagDisplay = document.createElement("a");
        tagDisplay.classList.add("tag");
        divs[i].appendChild(tagDisplay);
        //style
        divs[i].style.position = "relative";
        //設定動畫
        tagDisplay.classList.add("tagUnDisplay");
        tagDisplay.classList.add("animate");
        divs2[i].classList.add("animate");
        divs3[i].classList.add("animate");
        divs4[i].classList.add("animate");
        //加入button
        let tagbtn = document.createElement("button");
        tagbtn.classList.add("tagbtn");
        tagbtn.textContent = "顯示tag";
        divs[i].appendChild(tagbtn);
        //點擊button顯示tag
        tagbtn.addEventListener("click", () => {
            tagDisplay.classList.add("tagDisplay");
            tagDisplay.classList.remove("tagUnDisplay");
            divs2[i].style.opacity = 0;
            divs3[i].style.opacity = 0;
            divs4[i].style.opacity = 0;
            tagbtn.style.opacity = 0;
            //修正favorites裡點擊會觸發重新整理頁面的問題
            window.event.returnValue = false;
        });
        //雙擊tags回復狀態
        tagDisplay.addEventListener("dblclick", () => {
            tagDisplay.classList.add("tagUnDisplay");
            tagDisplay.classList.remove("tagDisplay");
            divs2[i].style.opacity = 1;
            divs3[i].style.opacity = 1;
            divs4[i].style.opacity = 1;
            tagbtn.style.opacity = 1;
        });
        //設定hover後出現button
        divs[i].addEventListener("mouseover", () => {
            tagbtn.style.display = "block";
        });
        divs[i].addEventListener("mouseout", () => {
            tagbtn.style.display = "none";
        });
        //內容文字
        if (tags[i].length === 0) {
            tagDisplay.innerHTML += "<span class='tagspan'>無</span>";
        }
        var tagType = "";
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
        for (let j = 0; j < tagsCount; j++) {
            const tag = tags[i][j].split(":");
            const temp = tag[tag.length - 1];
            //語言小圖標
            if (lanIcon[tags[i][j]]) {
                flaged = true;
                galleryTitle[i].innerHTML = `<img src='${lanIcon[tags[i][j]]}'>${galleryTitle[i].innerHTML}`;
            }
            //控制tag種類換行
            const thisTagType = tag[tag.length - 2];
            if (thisTagType != tagType && j != 0) {
                let nextLine = document.createElement("br");
                tagDisplay.appendChild(nextLine);
            }
            tagType = thisTagType;
            //屏蔽
            chrome.storage.sync.get("Uploaders", (list) => {
                if (list.Uploaders[uploaders[i]]) {
                    if (list.Uploaders[uploaders[i]] === "clear") {
                        galleryList.removeChild(divs[i]);
                        return;
                    }
                    image[i].src = list.Uploaders[uploaders[i]];
                    image[i].classList.add("imgSize");
                }
            });
            chrome.storage.sync.get("tags", (list) => {
                if (list.tags[temp]) {
                    if (list.tags[temp] === "clear") {
                        galleryList.removeChild(divs[i]);
                        return;
                    }
                    image[i].src = list.tags[temp];
                    image[i].classList.add("imgSize");
                }
            });
            //翻譯
            let transed;
            if (transSwitch) {
                transed = tData[temp] || tag[tag.length - 1];
            } else {
                transed = tag[tag.length - 1];
            }
            //創建tag span
            const lastSpan = document.createElement("span");
            lastSpan.textContent = transed;
            lastSpan.classList.add("tagspan");
            if (tagcolors[thisTagType]) {
                lastSpan.style.backgroundColor = tagcolors[thisTagType];
            } else {
                lastSpan.style.backgroundColor = "gray";
                break;
            }
            tagDisplay.appendChild(lastSpan);
        }
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
    document.querySelector(".load").remove();
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
            .then((res)=>{
                return res.json()
            })
            .then((data)=>{
                data.gmetadata.forEach(e => {
                    postedTime.push(e.posted);
                    tags.push(e.tags);
                    uploaders.push(e.uploader);
                });
            })
            .catch((err) => {
                console.log(err)
            })
    }
}