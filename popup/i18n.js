fetch(chrome.i18n.getMessage('popup_page'))
    .then((res) => {
        return res.text();
    })
    .then((res) => {
        document.write(res);
    })