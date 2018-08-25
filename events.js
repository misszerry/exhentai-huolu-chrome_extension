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
            const uploader = info.linkUrl.split("/").slice(-1)[0].replace("%2B"," ");
            console.log(`Add ${uploader} to list.`);
            chrome.storage.sync.get("Uploaders",
                (list) => {
                    let temp = list.Uploaders;
                    if(temp.includes(uploader)){
                        return;
                    }
                    temp.push(uploader);
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
                    if(temp.includes(tag)){
                        return;
                    }
                    temp.push(tag);
                    chrome.storage.sync.set({
                        tags: temp
                    })
                });
        } else {
            console.log("not tag or uploader.")
        }
    });
    chrome.storage.sync.get(null, (list) => {
        
        let tags = list.tags || [];
        let uploaders = list.Uploaders || [];

        // uses obj in the past , change it for old users

        if(!Array.isArray(tags)){
            tags = Object.keys(tags);
        }
        if(!Array.isArray(uploaders)){
            uploaders = Object.keys(uploaders);
        }
        
        
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
        const low_size = list.low_size || {"isOn":false,"size":0};
        chrome.storage.sync.set({
            "tags": tags,
            "Uploaders": uploaders,
            "run": run,
            "loca": loca,
            "trans": trans,
            "exLastViewTime": exLastViewTime,
            "eLastViewTime": eLastViewTime,
            "exReadTime": exReadTime,
            "eReadTime": eReadTime,
            "highLightSwitch": highLightSwitch,
            "low_size":low_size
        })
    })
});

chrome.runtime.onUpdateAvailable.addListener(()=>{
    chrome.runtime.reload();
})