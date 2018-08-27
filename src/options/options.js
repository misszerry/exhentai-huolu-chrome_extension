//i18n
const elements = document.querySelectorAll('[data-i18n]');
elements.forEach((e)=>{
    const locale_str = chrome.i18n.getMessage(e.dataset.i18n);
    if(locale_str !== e.innerHTML){
        e.innerHTML = locale_str;
    }
});

const transcheck = document.getElementById("trans");
const highLight = document.getElementById("highLight");
const low_size = document.getElementById("low_size");
const low_size_size = document.getElementById("low_size_size");
const defaulturl = `chrome-extension://${chrome.runtime.id}/res/default.jpg`;

//翻譯開關
transcheck.onchange = () => {
    chrome.storage.sync.set({
        trans: transcheck.checked
    });
};
//標亮開關
highLight.onchange = () => {
    chrome.storage.sync.set({
        highLightSwitch: highLight.checked
    });
};
//低容量開關
low_size.onchange = () => {
    chrome.storage.sync.set({
        low_size: {"isOn":low_size.checked,"size":low_size_size.value}
    });
};
low_size_size.onchange = ()=>{
    chrome.storage.sync.set({
        low_size: {"isOn":low_size.checked,"size":low_size_size.value}
    });
};
//開啟頁面的初始化
function init() {
    chrome.storage.sync.get(null, function (list) {
        let tagdis = document.getElementById("stags");
        let Updis = document.getElementById("sUPs");
        for (let i = 0; i < list.tags.length; i++) {
            let text = document.createElement("p");
            let tag = list.tags[i];
            text.textContent = tag;
            text.className = "tag";
            text.style.cursor = "pointer";
            tagdis.appendChild(text);
        }
        for (let i = 0; i < list.Uploaders.length; i++) {
            let text = document.createElement("p");
            let Uploader = list.Uploaders[i];
            text.textContent = Uploader;
            text.className = "uploader";
            text.style.cursor = "pointer";
            Updis.appendChild(text);
        }
        //設定雙擊刪除
        document.getElementById("block-container").addEventListener('dblclick', (e) => {
            if (e.target.classList.contains('tag')) {
                const text = e.target.textContent;
                chrome.storage.sync.get("tags",
                    (list) => {
                        let temp = list.tags;
                        temp.splice(temp.indexOf(text), 1);
                        chrome.storage.sync.set({
                            tags: temp
                        });
                    });
                e.target.remove();
            }else if(e.target.classList.contains('uploader')) {
                const text = e.target.textContent;
                chrome.storage.sync.get("Uploaders",
                    (list) => {
                        let temp = list.Uploaders;
                        temp.splice(temp.indexOf(text), 1);
                        chrome.storage.sync.set({
                            Uploaders: temp
                        });
                    });
                e.target.remove();
            }
        });
        transcheck.checked = list.trans;
        highLight.checked = list.highLightSwitch;
        low_size.checked = list.low_size.isOn;
        low_size_size.value = list.low_size.size;
    });
}
//初始化
init();
//新增完全屏蔽tag
document.getElementById("confirm-del-tag").onclick = (e) => {
    let text = document.getElementById('taginput').value;
    chrome.storage.sync.get("tags",
        (list) => {
            let temp = list.tags;
            if (temp.includes(text)) {
                return;
            }
            temp.push(text);
            chrome.storage.sync.set({
                tags: temp
            });
        });
};
//新增完全屏蔽uploader
document.getElementById("confirm-del-up").onclick = () => {
    let text = document.getElementById('UPinput').value;
    chrome.storage.sync.get("Uploaders",
        (list) => {
            let temp = list.Uploaders;
            if (temp.includes(text)) {
                return;
            }
            temp.push(text);
            chrome.storage.sync.set({
                Uploaders: temp
            });
        });
};
//移除tag
document.getElementById("removetag").onclick = () => {
    let text = document.getElementById('taginput').value;
    chrome.storage.sync.get("tags",
        (list) => {
            let temp = list.tags;
            if (!temp.includes(text)) {
                return;
            }
            temp.splice(temp.indexOf(text), 1);
            chrome.storage.sync.set({
                tags: temp
            });
        });
    location.reload();
};
//移除uploader
document.getElementById("removeUP").onclick = () => {
    let text = document.getElementById('UPinput').value;
    chrome.storage.sync.get("Uploaders",
        (list) => {
            let temp = list.Uploaders;
            if (!temp.includes(text)) {
                return;
            }
            temp.splice(temp.indexOf(text), 1);
            chrome.storage.sync.set({
                Uploaders: temp
            });
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
        "trans": false,
        "exLastViewTime": 0,
        "eLastViewTime": 0,
        "exReadTime": 0,
        "eReadTime": -1,
        "highLightSwitch": true,
        "low_size":{"isOn":false,"size":0}
    }, () => {
        location.reload();
    });
};