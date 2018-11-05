const except = chai.expect;

const i18n = { // eslint-disable-line no-unused-vars 
    "show_tag": "顯示tag",
    "close_tag": "返回封面",
    "no_tag": "無",
    "loading": "活路載入中",
    "block_warning": "屏蔽警告",
    "block_confirm": "點此確認",
    "low_size": "低容量"
};

const test_html = document.getElementById("test_html").innerHTML;

describe("dom.js", () => {

    describe("loader", () => {
        before(() => {
            addLoader();
        });
        it("should have div", () => {
            except(document.getElementById("load")).to.exist;
        });
        after(() => {
            document.getElementById("load").remove();
        });
    });

    describe("add card", () => {
        let div,card;
        
        before(()=>{
            document.getElementById("test_html").innerHTML = test_html;
            div = document.querySelector(".id1");
            card = addCard(div);
        });
        it("should have parent card", () => {
            except(div.parentElement).to.have.class("card");
        });
        it("should be in itg", () => {
            except(div.parentElement.parentElement).to.have.class("itg");
        });
        it("should have class card-front", () => {
            except(div).to.have.class("card-front");
        });
        it("should return card", () => {
            except(card).to.have.class("card");
        });
    });

    describe("add tag display", () => {
        let div,card,tagDisplay;
        
        before(()=>{
            document.getElementById("test_html").innerHTML = test_html;
            div = document.querySelector(".id1")
            card = addCard(div);
            tagDisplay = addTagDisplay(card);
        });
        it("should contain tag display div", () => {
            except(card).to.contain("div.tag.card-back.rotate180");
        });
        it("should return tag display", () => {
            except(tagDisplay).to.have.class("tag");
            except(tagDisplay).to.have.class("card-back")
            except(tagDisplay).to.have.class("rotate180")
        });
    });

    describe("add tag switch", () => {
        let div,card,switchBtn;
        before(() => {
            document.getElementById("test_html").innerHTML = test_html;
            div = document.querySelector(".id1")
            card = addCard(div);
            switchBtn = addTagSwitch(card);
        });
        it("should contain tag switch", () => {
            except(card).to.contain("button.tagBtn")
        });
        it("should return tag switch", () => {
            except(switchBtn).to.have.class("tagBtn");
        });
    });

    describe("click event of switch", () => {
        let div, card, switchBtn;

        before(() => {
            document.getElementById("test_html").innerHTML = test_html;
            div = document.querySelector(".id1")
            card = addCard(div);
            addTagDisplay(card);
            switchBtn = addTagSwitch(card);
            click_event_delegate();
        });
        it("[click 1 on switch] should rotate to back", () => {
            switchBtn.click();
            const front = document.querySelector(".card-front");
            const back = document.querySelector(".card-back");
            except(front).to.have.class("rotate-180");
            except(back).to.not.have.class("rotate180");
        });
        it("[click 2 on switch] should rotate to front", () => {
            switchBtn.click();
            const front = document.querySelector(".card-front");
            const back = document.querySelector(".card-back");
            except(front).to.not.have.class("rotate-180");
            except(back).to.have.class("rotate180");
        });
        it("[click 3 on card] should do nothing", () => {
            card.click();
            const front = document.querySelector(".card-front");
            const back = document.querySelector(".card-back");
            except(front).to.not.have.class("rotate-180");
            except(back).to.have.class("rotate180");
        });
        it("[click 3 on body] should do nothing", () => {
            document.body.click();
            const front = document.querySelector(".card-front");
            const back = document.querySelector(".card-back");
            except(front).to.not.have.class("rotate-180");
            except(back).to.have.class("rotate180");
        });
    });
});

describe("utils", () => {
    describe("get page data", () => {
        let as, data;

        before(() => {
            document.getElementById("test_html").innerHTML = test_html;
            as = document.querySelectorAll("div.id3 a");
            data = getRequestDataFromPage(as);
        });
        it("should return 3 data", () => {
            except(data.length).to.equal(3);
        });
        it("should contains correct data", () => {
            except(data[0]).to.deep.equal(['1278614', '21fce30d27']);
            except(data[1]).to.deep.equal(['1278613', 'c392836a54']);
            except(data[2]).to.deep.equal(['1278612', 'd889468646']);
        });
    });
    describe("fetch eh api",()=>{
        let res;
        before(async()=>{
            const data = [['1278614', '21fce30d27'],['1278613', 'c392836a54'],['1278612', 'd889468646']];
            res = await getGalleryData(data);
        });
        it("should return 5 arrays of data",()=>{
            except(Object.keys(res).length).to.equal(5);
        });
        it("should get correct results",()=>{
            except(res.filecount).deep.equal(["12", "22", "28"]);
            except(res.filesize).deep.equal([2646859, 7813479, 7132510]);
            except(res.postedTime).deep.equal(["1535531610", "1535531449", "1535531227"]);
            except(res.uploaders).deep.equal(["ebisumon", "ebisumon", "ebisumon"]);
        });
    });
});