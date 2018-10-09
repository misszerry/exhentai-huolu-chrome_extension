// event delegate
function click_event_delegate() { // eslint-disable-line no-unused-vars 
    const galleryList = document.querySelector(".ido");
    if (!galleryList) {
        return;
    }
    galleryList.addEventListener("click", (e) => {
        if (e.target.classList.contains("tagBtn")) {
            e.preventDefault(); // fix weird reload (?)
            const parent = e.target.parentElement;
            const front = parent.querySelector(".id1");
            const back = parent.querySelector(".tag");

            front.classList.toggle("rotate-180");
            back.classList.toggle("rotate180");
            if (back.classList.contains("rotate180")) {
                e.target.textContent = i18n.show_tag;
            } else {
                e.target.textContent = i18n.close_tag;
            }
        }
    });
}


function addLoader() { // eslint-disable-line no-unused-vars 
    const template = document.createRange().createContextualFragment(`<div class='load' id='load'><p>${i18n.loading}</p><div class='loader'></div></div>`);
    document.body.appendChild(template);
}

function addCard(child_div) { // eslint-disable-line no-unused-vars 
    const parent_div = child_div.parentElement;
    const card = document.createElement("div");
    card.classList.add("card");
    parent_div.appendChild(card);
    card.appendChild(child_div);
    child_div.classList.add("card-front");
    return card;
}

function addTagDisplay(card) { // eslint-disable-line no-unused-vars 
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

function addTagSwitch(card) { // eslint-disable-line no-unused-vars 
    const switchBtn = document.createElement("button");
    switchBtn.classList.add("tagBtn");
    switchBtn.textContent = i18n.show_tag;
    card.appendChild(switchBtn);
    return switchBtn;
}