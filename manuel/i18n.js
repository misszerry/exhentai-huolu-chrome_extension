fetch(chrome.i18n.getMessage('manuel_page'))
    .then((res) => {
        return res.text();
    })
    .then((res) => {
        document.write(res);
    })