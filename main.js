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
        let card = document.createElement("div");
        card.classList.add("card");
        galleryList.appendChild(card);
        card.appendChild(divs[i]);
        divs[i].classList.add("card-front")
        //新增視窗
        let tagDisplay = document.createElement("div");
        tagDisplay.classList.add("tag");
        tagDisplay.classList.add("card-back");
        tagDisplay.classList.add("rotate180");
        card.appendChild(tagDisplay);
        //style
        divs[i].style.position = "relative";
        tagDisplay.style.maxHeight = divs[i].style.height;

        card.addEventListener("mouseenter",()=>{
            divs[i].classList.add("rotate-180");
            tagDisplay.classList.remove("rotate180")
        });
        card.addEventListener("mouseleave",()=>{
            divs[i].classList.remove("rotate-180");
            tagDisplay.classList.add("rotate180");
        });
        card.addEventListener("click",()=>{
            divs[i].classList.toggle("rotate-180");
            tagDisplay.classList.toggle("rotate180");
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
                if (divs[i].classList.contains("field-front")){
                    return
                }
                if (list.Uploaders[uploaders[i]]) {
                    divs[i].classList.add("field-front");
                    tagDisplay.classList.add("field-back")

                    btn = document.createElement('div');
                    btn.innerHTML = `已屏蔽此漫畫<p class="field-span">Uploader : ${uploaders[i]}</p>點此確認`;
                    btn.classList.add("field-btn");
                    btn.addEventListener('click',function(){
                        divs[i].classList.remove("field-front");
                        tagDisplay.classList.remove("field-back")
                        divs[i].classList.toggle("rotate-180");
                        tagDisplay.classList.toggle("rotate180");
                        this.remove();
                    });
                    card.appendChild(btn);
                }
            });
            chrome.storage.sync.get("tags", (list) => {
                if (divs[i].classList.contains("field-front")){
                    return
                }
                if (list.tags[temp]) {
                    divs[i].classList.add("field-front");
                    tagDisplay.classList.add("field-back")

                    btn = document.createElement('div');
                    btn.innerHTML = `已屏蔽此漫畫<p class="field-span">tag : ${temp}</p>點此確認`;
                    btn.classList.add("field-btn");
                    btn.addEventListener('click',function(){
                        divs[i].classList.remove("field-front");
                        tagDisplay.classList.remove("field-back")
                        divs[i].classList.toggle("rotate-180");
                        tagDisplay.classList.toggle("rotate180");
                        this.remove();
                    });
                    card.appendChild(btn);
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