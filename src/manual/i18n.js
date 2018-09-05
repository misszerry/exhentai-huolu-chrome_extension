const elements = document.querySelectorAll("[data-i18n]");
elements.forEach((e)=>{
    const locale_str = chrome.i18n.getMessage(e.dataset.i18n);
    if(locale_str !== e.innerHTML){
        e.innerHTML = locale_str;
    }
});