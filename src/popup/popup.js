const switchBox = document.getElementById("switch-box");
const setLastTime = document.getElementById("setLastTime");
const config = document.getElementById("config");
const symbol = document.getElementById("symbol");

// i18n
const elements = document.querySelectorAll("[data-i18n]");
elements.forEach((e) => {
    const locale_str = chrome.i18n.getMessage(e.dataset.i18n);
    if (locale_str !== e.innerHTML) {
        e.innerHTML = locale_str;
    }
});

/* init */
(function init() {
    chrome.storage.sync.get("run", ({
        run
    }) => {
        switchBox.checked = run;
    });
})();

/* handle on/off function */
switchBox.addEventListener("change", function () {
    chrome.storage.sync.set({
        run: this.checked
    });
});

//navigate to setting page
config.onclick = () => {
    if (chrome.runtime.openOptionsPage) { // New way to open options pages, if supported (Chrome 42+).
        chrome.runtime.openOptionsPage();
    } else { // Reasonable fallback.
        window.open(chrome.runtime.getURL("options.html"));
    }
};
chrome.storage.sync.get(null, (list) => {
    if (list.exReadTime == list.exLastViewTime && list.eReadTime == list.eLastViewTime) {
        setLastTime.disabled = "true";
        setLastTime.textContent = chrome.i18n.getMessage("popup_update");
        setLastTime.classList.remove("item-hover");
        symbol.style.display = "block";
    }
});
// update saved time manually
setLastTime.onclick = () => {
    chrome.storage.sync.get(null, (list) => {
        const exReadTime = list.exReadTime;
        const eReadTime = list.eReadTime;
        chrome.storage.sync.set({
            exLastViewTime: exReadTime,
            eLastViewTime: eReadTime
        });
        setLastTime.disabled = "true";
        setLastTime.textContent = chrome.i18n.getMessage("popup_update");
        setLastTime.classList.remove("item-hover");
        symbol.style.display = "block";
    });
};