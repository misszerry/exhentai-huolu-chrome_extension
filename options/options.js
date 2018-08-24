const locacheck = document.getElementById("loca");
const transcheck = document.getElementById("trans");
const highLight = document.getElementById("highLight");
const urlInput = document.getElementById("urlInput");
const urlButton = document.getElementById("locaUrlButton");
const defaulturl = `chrome-extension://${chrome.runtime.id}/res/default.jpg`;

//重新導向開關
locacheck.onchange = () => {
    chrome.storage.sync.get("loca",
        (list) => {
            let temp = list.loca.url;
            chrome.storage.sync.set({
                loca: {
                    switch: locacheck.checked,
                    url: temp
                }
            })
        });
    location.reload();
};
//重新導向網址確認按鈕
document.getElementById("locaUrlButton").onclick = () => {
    chrome.storage.sync.set({
        loca: {
            switch: locacheck.checked,
            url: urlInput.value
        }
    });
    location.reload();
};
//翻譯開關
transcheck.onchange = () => {
    chrome.storage.sync.set({
        trans: transcheck.checked
    })
}
//標亮開關
highLight.onchange = () => {
    chrome.storage.sync.set({
        highLightSwitch: highLight.checked
    })
}
//開啟頁面的初始化
function init() {
    chrome.storage.sync.get(null, function (list) {
        let tagdis = document.getElementById("stags");
        let Updis = document.getElementById("sUPs");
        for (let i = 0; i < list.tags.length; i++) {
            let tagBox = document.createElement("div");
            let text = document.createElement("p");
            let tag = list.tags[i];
            tagBox.classList.add("imgBox");
            text.textContent = tag;
            text.className = "tag";
            text.style.cursor = "pointer";
            tagBox.appendChild(text);
            tagdis.appendChild(tagBox);
        }
        for (let i = 0; i < list.Uploaders.length; i++) {
            let upBox = document.createElement("div");
            let text = document.createElement("p");
            let Uploader = list.Uploaders[i];
            upBox.classList.add("imgBox");
            text.textContent = Uploader;
            text.className = "Uploader";
            text.style.cursor = "pointer";
            upBox.appendChild(text);
            Updis.appendChild(upBox);
        }
        //設定雙擊刪除
        const tagElements = document.querySelectorAll("div#stags p.tag");
        const UpElements = document.querySelectorAll("div#sUPs p.Uploader");
        for (let i = 0; i < Object.keys(list.tags).length; i++) {
            tagElements[i].ondblclick = (e) => {
                const text = e.target.textContent;
                chrome.storage.sync.get("tags",
                    (list) => {
                        let temp = list.tags;
                        temp.splice(temp.indexOf(text),1);
                        chrome.storage.sync.set({
                            tags: temp
                        })
                    });
                location.reload();
            }
        }
        for (let i = 0; i < Object.keys(list.Uploaders).length; i++) {
            UpElements[i].ondblclick = (e) => {
                const text = e.target.textContent;
                chrome.storage.sync.get("Uploaders",
                    (list) => {
                        let temp = list.Uploaders;
                        temp.splice(temp.indexOf(text),1);
                        chrome.storage.sync.set({
                            Uploaders: temp
                        })
                    });
                location.reload();
            }
        }
        locacheck.checked = list.loca.switch;
        transcheck.checked = list.trans;
        highLight.checked = list.highLightSwitch;
        urlInput.value = list.loca.url;
    });
}
//初始化
init();
//新增完全屏蔽tag
document.getElementById("confirm-del-tag").onclick = () => {
    let text = document.getElementById('taginput').value;
    chrome.storage.sync.get("tags",
        (list) => {
            let temp = list.tags;
            if(temp.includes(text)){
                return;
            }
            temp.push(text);
            chrome.storage.sync.set({
                tags: temp
            })
        });
};
//新增完全屏蔽uploader
document.getElementById("confirm-del-up").onclick = () => {
    let text = document.getElementById('UPinput').value;
    chrome.storage.sync.get("Uploaders",
        (list) => {
            let temp = list.Uploaders;
            if(temp.includes(text)){
                return;
            }
            temp.push(text);
            chrome.storage.sync.set({
                Uploaders: temp
            })
        });
};
//移除tag
document.getElementById("removetag").onclick = () => {
    let text = document.getElementById('taginput').value;
    chrome.storage.sync.get("tags",
        (list) => {
            let temp = list.tags;
            if(!temp.includes(text)){
                return;
            }
            temp.splice(temp.indexOf(text),1);
            chrome.storage.sync.set({
                tags: temp
            })
        });
    location.reload();
};
//移除uploader
document.getElementById("removeUP").onclick = () => {
    let text = document.getElementById('UPinput').value;
    chrome.storage.sync.get("Uploaders",
        (list) => {
            let temp = list.Uploaders;
            if(!temp.includes(text)){
                return;
            }
            temp.splice(temp.indexOf(text),1);
            chrome.storage.sync.set({
                Uploaders: temp
            })
        });
    location.reload();
};
//初始化按鈕
document.getElementById('del').onclick = () => {
    chrome.storage.sync.clear();
    chrome.storage.sync.set({
        "tags": [],
        "Uploaders": [],
        "run": true,
        "loca": {
            switch: false,
            url: ""
        },
        "trans": false,
        "exLastViewTime": 0,
        "eLastViewTime": 0,
        "exReadTime": 0,
        "eReadTime": -1,
        "highLightSwitch": true
    }, () => {
        window.close();
    })
};