fetch(chrome.i18n.getMessage('options_page'))
    .then((res) => {
        return res.text();
    })
    .then((res) => {
        document.write(res);
    })