import { expect } from "chai";

import * as dom from "../src/dom";

const fakeDocument = {
    documentElement: {
        scrollTop: 0,
        scrollLeft: 0
    },
    body: {
        scrollTop: 100,
        scrollLeft: 50
    }
};

describe("DOM utilities", () => {
    describe("getPageScroll", () => {
        it("must return an object with `left` and `top` numeric properties", () => {
            const scroll = dom.getPageScroll(fakeDocument);
            expect(scroll).to.be.an("object");
            expect(scroll.left).to.be.a("number");
            expect(scroll.top).to.be.a("number");
        });
        it("must return the normalized top and left scroll of the page", () => {
            const scroll = dom.getPageScroll(fakeDocument);
            expect(scroll).to.eql({ top: 100, left: 50 });
        });
    });
});
