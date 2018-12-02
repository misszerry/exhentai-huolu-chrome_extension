// initialize data storage
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(null, (list) => {

        let tags = list.tags || [];
        let uploaders = list.uploaders || list.Uploaders || [];
        let whitelistTags = list["whitelist-tags"] || [];
        let whitelistUploaders = list["whitelist-uploaders"] || [];

        /////////////////////////////////
        // uses obj in the past , change it for old users
        if (!Array.isArray(tags)) {
            tags = Object.keys(tags);
        }
        if (!Array.isArray(uploaders)) {
            uploaders = Object.keys(uploaders);
        }
        /////////////////////////////////

        if(Object.keys(list).includes("Uploaders")){
            chrome.storage.sync.remove("Uploaders",()=>{});
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
        const low_size = list.low_size || {
            "isOn": false,
            "size": 0
        };
        chrome.storage.sync.set({
            "tags": tags,
            "uploaders": uploaders,
            "whitelist-tags":whitelistTags,
            "whitelist-uploaders":whitelistUploaders,
            "run": run,
            "loca": loca,
            "trans": trans,
            "exLastViewTime": exLastViewTime,
            "eLastViewTime": eLastViewTime,
            "exReadTime": exReadTime,
            "eReadTime": eReadTime,
            "highLightSwitch": highLightSwitch,
            "low_size": low_size
        });
    });
});

// reload extension while update
chrome.runtime.onUpdateAvailable.addListener(() => {
    chrome.runtime.reload();
});

// create context menu
chrome.contextMenus.removeAll(()=>{
    chrome.contextMenus.create({
        title: chrome.i18n.getMessage("context_menu"),
        id: "item1",
        type: "normal",
        contexts: ["link"],
        documentUrlPatterns: ["https://exhentai.org/g/*", "https://e-hentai.org/g/*"]
    });
});

// handle context menu
chrome.contextMenus.onClicked.addListener(function (info) {
    if (info.linkUrl.match("/uploader/")) {
        const uploader = info.linkUrl.split("/").slice(-1)[0].replace("%2B", " ");
        chrome.storage.sync.get("uploaders",
            (list) => {
                let temp = list.uploaders;
                if (temp.includes(uploader)) {
                    return;
                }
                temp.push(uploader);
                chrome.storage.sync.set({
                    uploaders: temp
                });
            });
    } else if (info.linkUrl.match("/tag/")) {
        const tag = info.linkUrl.split("/").slice(-1)[0].split("%3A").slice(-1)[0].replace("+", " ");
        chrome.storage.sync.get("tags",
            (list) => {
                let temp = list.tags;
                if (temp.includes(tag)) {
                    return;
                }
                temp.push(tag);
                chrome.storage.sync.set({
                    tags: temp
                });
            });
    }
});

// change icon
chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.message === "active") {
        chrome.browserAction.setIcon({
            path: "res/icon16.png",
            tabId: sender.tab.id
        });
    }
});

// set badge color
chrome.browserAction.setBadgeBackgroundColor({
    color: "#ee5253"
});

// set text on / off
chrome.storage.onChanged.addListener((change) => {
    if (change.run) {
        if (!change.run.newValue) {
            chrome.browserAction.setBadgeText({
                text: "OFF"
            });
        } else {
            chrome.browserAction.setBadgeText({
                text: ""
            });
        }
    }
});