/* data fields */
let transSwitch; // 翻譯開關
let highLightSwitch; // 標亮開關
let time; // 歷史讀到的最新時間
let readTime; // 本頁最新時間
let maxTime;
let minTime;
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
            init()
        }
    });

async function init() {
    //Loading視覺化
    addLoader();

    //取得各gallery的gid與token
    let all_request_data = []
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
        max_height = divs[i].style.height.match(/\d+/);
        tagDisplay.style.maxHeight = Number(max_height) + 5 + "px";

        //新增按鈕
        const switchBtn = addTagSwitch(card)

        switchBtn.addEventListener("click", function (e) {
            e.preventDefault(); // 暫時避免頁面被莫名重整
            divs[i].classList.toggle("rotate-180");
            tagDisplay.classList.toggle("rotate180")
            if (tagDisplay.classList.contains("rotate180")) {
                this.textContent = "顯示tag"
            } else {
                this.textContent = "返回封面"
            }
        });

        card.addEventListener("mouseenter", function () {
            this.querySelector('.tagBtn').style.display = "block";
            setTimeout(() => {
                this.querySelector('.tagBtn').classList.remove("fade-out");
                this.querySelector('.tagBtn').classList.add("fade-in");
            }, .000001)

        });
        card.addEventListener("mouseleave", function () {
            this.querySelector('.tagBtn').classList.add("fade-out");
            this.querySelector('.tagBtn').classList.remove("fade-in");
            this.querySelector('.tagBtn').style.display = "none";
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
        const tag_fragment = document.createDocumentFragment();
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
                tag_fragment.appendChild(nextLine);
            }
            tagType = thisTagType;
            //屏蔽
            chrome.storage.sync.get("Uploaders", (list) => {
                if (divs[i].classList.contains("rotate-180")) {
                    return
                }
                if (list.Uploaders[uploaders[i]]) {
                    divs[i].classList.add("rotate-180");
                    tagDisplay.classList.remove("rotate180")
                    card.querySelector('.tagBtn').textContent = "返回封面";

                    btn = document.createElement('div');
                    btn.innerHTML = `屏蔽警告<p class="field-span">Uploader : ${uploaders[i]}</p>點此確認`;
                    btn.classList.add("field-btn");
                    btn.addEventListener('click', function () {
                        this.remove();
                    });
                    card.appendChild(btn);
                }
            });
            chrome.storage.sync.get("tags", (list) => {
                if (divs[i].classList.contains("rotate-180")) {
                    return
                }
                if (list.tags[temp]) {
                    divs[i].classList.add("rotate-180");
                    tagDisplay.classList.remove("rotate180")
                    card.querySelector('.tagBtn').textContent = "返回封面";

                    btn = document.createElement('div');
                    btn.innerHTML = `屏蔽警告<p class="field-span">tag : ${temp}</p>點此確認`;
                    btn.classList.add("field-btn");
                    btn.addEventListener('click', function () {
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