import { expect } from "chai";

const utils = require("../src/utils");

const fakeDocument = {
    documentElement: {
        scrollTop: 0,
        scrollLeft: 0
    },
    body: {
        scrollTop: 100,
        scrollLeft: 50
    }
}

describe("Package utilities", () => {
    describe("getPageScroll", () => {
        it("must return an object with `left` and `top` numeric properties", () => {
            const scroll = utils.getPageScroll(fakeDocument);
            expect(scroll).to.be.an("object");
            expect(scroll.left).to.be.a("number");
            expect(scroll.top).to.be.a("number");
        });
        it("must return the normalized top and left scroll of the page", () => {
            const scroll = utils.getPageScroll(fakeDocument);
            expect(scroll).to.eql({ top: 100, left: 50 });
        });
    });
    describe("camelize", () => {
        it("must capitalize the first letter of a string", () => {
            expect(utils.camelize("foo")).to.equal("Foo");
            expect(utils.camelize(" unfoo")).to.equal(" unfoo");
        });
        it("must transform dash-separated words in camel case", () => {
            expect(utils.camelize("foo-bar")).to.equal("FooBar");
            expect(utils.camelize("foo-")).to.equal("Foo-");
        });
    });
});
