var expect = require("chai").expect;

var utils = require("../src/utils");

var fakeDocument = {
    documentElement: {
        scrollTop: 0,
        scrollLeft: 0
    },
    body: {
        scrollTop: 100,
        scrollLeft: 50
    }
}

describe("Package utilities", function() {
    describe("getPageScroll", function() {
        it("must return an object with `left` and `top` numeric properties", function() {
            var scroll = utils.getPageScroll(fakeDocument);
            expect(scroll).to.be.an("object");
            expect(scroll.left).to.be.a("number");
            expect(scroll.top).to.be.a("number");
        });
        it("must return the normalized top and left scroll of the page", function() {
            var scroll = utils.getPageScroll(fakeDocument);
            expect(scroll).to.eql({ top: 100, left: 50 });
        });
    });
    describe("camelize", function() {
        it("must capitalize the first letter of a string", function() {
            expect(utils.camelize("foo")).to.equal("Foo");
            expect(utils.camelize(" unfoo")).to.equal(" unfoo");
        });
        it("must transform dash-separated words in camel case", function() {
            expect(utils.camelize("foo-bar")).to.equal("FooBar");
            expect(utils.camelize("foo-")).to.equal("Foo-");
        });
    });
});
