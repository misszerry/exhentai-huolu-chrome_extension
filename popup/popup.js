const open = document.getElementById("open");
const close = document.getElementById("close");
const setLastTime = document.getElementById("setLastTime");
const rankingYesterday = [];
const gid = [];
const token = [];
const gdata = [];

init();
/* 初始化開關 */
function init() {
    chrome.storage.sync.get(null,
        (list) => {
            let temp = list.run;
            if (temp) {
                opening();
            } else {
                closing();
            }
        });
}

/* 開關function */
function opening() {
    open.classList.add("active");
    close.classList.remove("active");
    chrome.storage.sync.set({
        run: true
    });
}

function closing() {
    open.classList.remove("active");
    close.classList.add("active");
    chrome.storage.sync.set({
        run: false
    });
}
open.onclick = () => {
    open.classList.add("active");
    close.classList.remove("active");
    chrome.storage.sync.set({
        run: true
    });
    location.reload();
}
close.onclick = () => {
    open.classList.add("active");
    close.classList.remove("active");
    chrome.storage.sync.set({
        run: false
    });
    location.reload();
}
//進入設定頁面
config.onclick = () => {
    if (chrome.runtime.openOptionsPage) { // New way to open options pages, if supported (Chrome 42+).
        chrome.runtime.openOptionsPage();
    } else { // Reasonable fallback.
        window.open(chrome.runtime.getURL('options.html'));
    }
}
chrome.storage.sync.get(null,
    (list) => {
        if (list.exReadTime == list.exLastViewTime && list.eReadTime == list.eLastViewTime) {
            setLastTime.classList.remove("btn-success");
            setLastTime.classList.add("btn-info");
            setLastTime.disabled="true";
            setLastTime.textContent = "已同步";
        }
    });
//強制更新時間
setLastTime.onclick = () => {
    let exReadTime;
    let eReadTime;
    chrome.storage.sync.get(null,
        (list) => {
            exReadTime = list.exReadTime;
            eReadTime = list.eReadTime;
            chrome.storage.sync.set({
                exLastViewTime: exReadTime,
                eLastViewTime: eReadTime
            });
            setLastTime.disabled="true";
            setLastTime.textContent = "已同步";
            setLastTime.classList.remove("btn-success");
            setLastTime.classList.add("btn-info");
        })
}