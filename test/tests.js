const except = chai.expect;

const i18n = {// eslint-disable-line no-unused-vars 
    "show_tag" : "顯示tag",
    "close_tag": "返回封面",
    "no_tag": "無",
    "loading": "活路載入中",
    "block_warning":"屏蔽警告",
    "block_confirm":"點此確認",
    "low_size":"低容量"
};

const test_html = document.getElementById("test_html").innerHTML;

describe("dom.js",()=>{

    describe("loader",()=>{
        before(()=>{
            addLoader();
        });
        it("should have div",()=>{
            except(document.getElementById("load")).to.exist;
        });
        after(()=>{
            document.getElementById("load").remove();
        });
    });

    describe("add card",()=>{
        document.getElementById("test_html").innerHTML = test_html;
        const div = document.querySelector(".id1");
        const card = addCard(div);
        it("should have parent card",()=>{
            except(div.parentElement).to.have.class("card");
        });
        it("should be in itg",()=>{
            except(div.parentElement.parentElement).to.have.class("itg");
        });
        it("should have class card-front",()=>{
            except(div).to.have.class("card-front");
        });
        it("should return card",()=>{
            except(card).to.have.class("card");
        });
    });

    describe("add tag display",()=>{
        document.getElementById("test_html").innerHTML = test_html;
        const div = document.querySelector(".id1")
        const card = addCard(div);
        const tagDisplay = addTagDisplay(card);
        it("should contain tag display div",()=>{
            except(card).to.contain("div.tag.card-back.rotate180");
        });
        it("should return tag display",()=>{
            except(tagDisplay).to.have.class("tag");
            except(tagDisplay).to.have.class("card-back")
            except(tagDisplay).to.have.class("rotate180")
        });
    });

    describe("add tag switch",()=>{
        document.getElementById("test_html").innerHTML = test_html;
        const div = document.querySelector(".id1")
        const card = addCard(div);
        const switchBtn = addTagSwitch(card);
        it("should contain tag switch",()=>{
            except(card).to.contain("button.tagBtn")
        });
        it("should return tag switch",()=>{
            except(switchBtn).to.have.class("tagBtn");
        });
    });

    describe("click event of switch",()=>{
        document.getElementById("test_html").innerHTML = test_html;
        const div = document.querySelector(".id1")
        const card = addCard(div);
        addTagDisplay(card);
        const switchBtn = addTagSwitch(card);
        
        before(()=>{
            click_event_delegrat();
        });
        it("[click 1 on switch] should rotate to back",()=>{
            switchBtn.click();
            const front = document.querySelector(".card-front");
            const back = document.querySelector(".card-back");
            except(front).to.have.class("rotate-180")
            except(back).to.not.have.class("rotate180")
        });
        it("[click 2 on switch] should rotate to front",()=>{
            switchBtn.click();
            const front = document.querySelector(".card-front");
            const back = document.querySelector(".card-back");
            except(front).to.not.have.class("rotate-180")
            except(back).to.have.class("rotate180")
        });
        it("[click 3 on card] should do nothing",()=>{
            card.click();
            const front = document.querySelector(".card-front");
            const back = document.querySelector(".card-back");
            except(front).to.not.have.class("rotate-180")
            except(back).to.have.class("rotate180")
        });
        it("[click 3 on body] should do nothing",()=>{
            document.body.click();
            const front = document.querySelector(".card-front");
            const back = document.querySelector(".card-back");
            except(front).to.not.have.class("rotate-180")
            except(back).to.have.class("rotate180")
        });
    });
});