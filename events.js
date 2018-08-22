//安裝與更新的初始化
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        "title": chrome.i18n.getMessage("context_menu"),
        "id": "item1",
        "type": "normal",
        "contexts": ['link'],
        "documentUrlPatterns": ["https://exhentai.org/g/*","https://e-hentai.org/g/*"]
    });
    chrome.contextMenus.onClicked.addListener(function (info) {
        if (info.linkUrl.match("/uploader/")) {
            const uploader = info.linkUrl.split("/").slice(-1)[0];
            console.log(`Add ${uploader} to list.`);
            chrome.storage.sync.get("Uploaders",
                (list) => {
                    let temp = list.Uploaders;
                    temp[uploader] = "clear";
                    chrome.storage.sync.set({
                        Uploaders: temp
                    })
                });
        } else if (info.linkUrl.match("/tag/")) {
            const tag = info.linkUrl.split("/").slice(-1)[0].split("%3A").slice(-1)[0].replace("+", " ");
            console.log(`Add ${tag} to list.`);
            chrome.storage.sync.get("tags",
                (list) => {
                    let temp = list.tags;
                    temp[tag] = "clear";
                    chrome.storage.sync.set({
                        tags: temp
                    })
                });
        } else {
            console.log("not tag or uploader.")
        }
    });
    chrome.storage.sync.get(null, (list) => {
        const tags = list.tags || {};
        const Uploaders = list.Uploaders || {};
        const run = list.run || true;
        const loca = list.loca || {
            switch: false,
            url: ""
        };
        const trans = list.trans || false;
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