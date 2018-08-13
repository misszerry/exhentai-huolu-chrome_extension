const galleryList = document.querySelector(".itg");

function addLoader() {
    const load = document.createElement("div");
    const loader = document.createElement("div");
    const loadText = document.createElement("p");
    loadText.textContent = "活路載入中";
    load.classList.add("load");
    loader.classList.add("loader");
    load.appendChild(loadText);
    load.appendChild(loader);
    document.body.appendChild(load);
}

function addCard(child_div) {
    const card = document.createElement("div");
    card.classList.add("card");
    galleryList.appendChild(card);
    card.appendChild(child_div);
    child_div.classList.add("card-front")
    return card;
}

function addTagDisplay(card) {
    const tagDisplay = document.createElement("div");
    tagDisplay.classList.add("tag");
    tagDisplay.classList.add("card-back");
    tagDisplay.classList.add("rotate180");
    card.appendChild(tagDisplay);

    if (location.href.match("exhentai")) {
        tagDisplay.style.background = "#43464e";
        tagDisplay.style.border = "1px solid #34353b";
    } else if (location.href.match("e-hentai")) {
        tagDisplay.style.background = "#F2EFDF";
        tagDisplay.style.border = "1px solid #E3E0D1";
    }

    return tagDisplay;
}

function addTagSwitch(card) {
    switchBtn = document.createElement("button");
    switchBtn.classList.add("tagBtn");
    switchBtn.textContent = "顯示tag"
    switchBtn.classList.add("fade-out");
    card.appendChild(switchBtn);
    return switchBtn;
}