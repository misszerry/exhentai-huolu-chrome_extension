//重新導向
chrome.storage.sync.get(null,
    (list) => {
        const reDirect = list.loca.switch;
        const url = list.loca.url;
        const run = list.run;
        if (run && reDirect) {
            location.href = url;
        }
    });