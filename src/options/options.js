//i18n
const elements = document.querySelectorAll("[data-i18n]");
elements.forEach((e) => {
    const locale_str = chrome.i18n.getMessage(e.dataset.i18n);
    if (locale_str !== e.innerHTML) {
        e.innerHTML = locale_str;
    }
});

const transcheck = document.getElementById("trans");
const highLight = document.getElementById("highLight");
const low_size = document.getElementById("low_size");
const low_size_size = document.getElementById("low_size_size");

// translate switch
transcheck.onchange = () => {
    chrome.storage.sync.set({
        trans: transcheck.checked
    });
};
// highlight switch
highLight.onchange = () => {
    chrome.storage.sync.set({
        highLightSwitch: highLight.checked
    });
};
// low size tag switch
low_size.onchange = () => {
    chrome.storage.sync.set({
        low_size: {
            "isOn": low_size.checked,
            "size": low_size_size.value
        }
    });
};
low_size_size.onchange = () => {
    chrome.storage.sync.set({
        low_size: {
            "isOn": low_size.checked,
            "size": low_size_size.value
        }
    });
};
// initialize page
(function init() {
    chrome.storage.sync.get(null, function (list) {
        const tag_dis = document.getElementById("blacklist-tag-display");
        const up_dis = document.getElementById("blacklist-uploader-display");
        const whitelist_tag_dis = document.getElementById("whitelist-tag-display");
        const whitelist_uploader_dis = document.getElementById("whitelist-uploader-display");
        for (let i = 0; i < list.tags.length; i++) {
            render_list("tags",list.tags[i],tag_dis);
        }
        for (let i = 0; i < list.uploaders.length; i++) {
            render_list("uploaders",list.uploaders[i],up_dis);
        }
        for (let i = 0; i < list["whitelist-tags"].length; i++) {
            render_list("whitelist-tags",list["whitelist-tags"][i],whitelist_tag_dis);
        }
        for (let i = 0; i < list["whitelist-uploaders"].length; i++) {
            render_list("whitelist-uploaders",list["whitelist-uploaders"][i],whitelist_uploader_dis);
        }
        transcheck.checked = list.trans;
        highLight.checked = list.highLightSwitch;
        low_size.checked = list.low_size.isOn;
        low_size_size.value = list.low_size.size;
    });
}());

// dbclick to remove
document.getElementById("block-container").addEventListener("click", (e) => {
    if(e.target.classList.contains("remove-button")){
        remove_storage(e.target);
    }
});

/* Blacklist */

// add block tag
document.getElementById("blacklist-tag-form").onsubmit = () => {
    let text = document.getElementById("blacklist-tag-input").value;
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

// add block uploader
document.getElementById("blacklist-uploader-form").onsubmit = () => {
    let text = document.getElementById("blacklist-uploader-input").value;
    chrome.storage.sync.get("uploaders",
        (list) => {
            let temp = list.uploaders;
            if (temp.includes(text)) {
                return;
            }
            temp.push(text);
            chrome.storage.sync.set({
                uploaders: temp
            });
        });
};

// remove tag
document.getElementById("blacklist-tag-remove").onclick = () => {
    let text = document.getElementById("blacklist-tag-input").value;
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
// remove uploader
document.getElementById("blacklist-uploader-remove").onclick = () => {
    let text = document.getElementById("blacklist-uploader-input").value;
    chrome.storage.sync.get("uploaders",
        (list) => {
            let temp = list.uploaders;
            if (!temp.includes(text)) {
                return;
            }
            temp.splice(temp.indexOf(text), 1);
            chrome.storage.sync.set({
                uploaders: temp
            });
        });
    location.reload();
};

/* Whitelist */

// add whitelist tag
document.getElementById("whitelist-tag-form").onsubmit = () => {
    let text = document.getElementById("whitelist-tag-input").value;
    chrome.storage.sync.get("whitelist-tags",
        (list) => {
            let temp = list["whitelist-tags"];
            if (temp.includes(text)) {
                return;
            }
            temp.push(text);
            chrome.storage.sync.set({
                "whitelist-tags": temp
            });
        });
};

// add whitelist uploader
document.getElementById("whitelist-uploader-form").onsubmit = () => {
    let text = document.getElementById("whitelist-uploader-input").value;
    chrome.storage.sync.get("whitelist-uploaders",
        (list) => {
            let temp = list["whitelist-uploaders"];
            if (temp.includes(text)) {
                return;
            }
            temp.push(text);
            chrome.storage.sync.set({
                "whitelist-uploaders": temp
            });
        });
};

// remove tag
document.getElementById("whitelist-tag-remove").onclick = () => {
    let text = document.getElementById("whitelist-tag-input").value;
    chrome.storage.sync.get("whitelist-tags",
        (list) => {
            let temp = list["whitelist-tags"];
            if (!temp.includes(text)) {
                return;
            }
            temp.splice(temp.indexOf(text), 1);
            chrome.storage.sync.set({
                "whitelist-tags": temp
            });
        });
    location.reload();
};
// remove uploader
document.getElementById("whitelist-uploader-remove").onclick = () => {
    let text = document.getElementById("whitelist-uploader-input").value;
    chrome.storage.sync.get("whitelist-uploaders",
        (list) => {
            let temp = list["whitelist-uploaders"];
            if (!temp.includes(text)) {
                return;
            }
            temp.splice(temp.indexOf(text), 1);
            chrome.storage.sync.set({
                "whitelist-uploaders": temp
            });
        });
    location.reload();
};

// initialize button
document.getElementById("init_btn").onclick = () => {
    chrome.storage.sync.clear();
    chrome.storage.sync.set({
        "tags": [],
        "uploaders": [],
        "whitelist-tags": [],
        "whitelist-uploaders": [],
        "run": true,
        "trans": false,
        "exLastViewTime": 0,
        "eLastViewTime": 0,
        "exReadTime": 0,
        "eReadTime": -1,
        "highLightSwitch": true,
        "low_size": {
            "isOn": false,
            "size": 0
        }
    }, () => {
        location.reload();
    });
};

function render_list(type,content,list_element) {
    let text = document.createElement("p");
    text.textContent = content;
    text.className = type;

    // remove button
    const remove_button = document.createElement("button");
    remove_button.innerHTML = "&#x2716;";
    remove_button.classList.add("remove-button");
    remove_button.setAttribute("data-content",content);
    remove_button.setAttribute("data-type",type);

    text.appendChild(remove_button);

    list_element.appendChild(text);
}

function remove_storage(target) {
    const text = target.dataset.content;
    const type = target.dataset.type;
    chrome.storage.sync.get(type,
        (list) => {
            let temp = list[type];
            temp.splice(temp.indexOf(text), 1);
            chrome.storage.sync.set({
                [type]: temp
            });
        });
    target.parentElement.remove();
}