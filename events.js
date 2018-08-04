//安裝與更新的初始化
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(null, (list) => {
        const tags = list.tags || {};
        const Uploaders = list.Uploaders || {};
        const run = list.run || true;
        const loca = list.loca || {
            switch: false,
            url: ""
        };
        const trans = list.trans || true;
        const exLastViewTime = list.exLastViewTime || 0;
        const eLastViewTime = list.eLastViewTime || 0;
        const exReadTime = list.exReadTime || 0;
        const eReadTime = list.eReadTime || -1;
        const highLightSwitch = list.highLightSwitch || true;
        chrome.storage.sync.set({
            "tags": tags,
            "Uploaders": Uploaders,
            "run": run,
            "loca": loca,
            "trans": trans,
            "exLastViewTime": exLastViewTime,
            "eLastViewTime": eLastViewTime,
            "exReadTime": exReadTime,
            "eReadTime": eReadTime,
            "highLightSwitch": highLightSwitch
        })
    })
});
