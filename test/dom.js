import { expect } from "chai";
import { env } from "jsdom";

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

    describe("matches", () => {
        it("must work like `Element.prototype.matches`", done => {
            env("<div class='wrapper' id='main'><span class='foo'>Bar</span></div>", (err, _window) => {
                expect(err).to.be.null;

                const selectorMatches = {
                    ".foo": ".wrapper > span",
                    "span": "div *",
                    "#main": "main",
                    "span": "#main > span"
                };

                for (const selector of Object.keys(selectorMatches)) {
                    const match = selectorMatches[selector];
                    const element = _window.document.querySelector(selector);
                    if (!element) {
                        return done(Error(`Can't find element ${selector}`));
                    }

                    const test = dom.matches(element, match);
                    if (test !== element.matches(match)) {
                        return done(Error(`Element ${selector} doesn't behave like 'matches' for ${match} (${test})`));
                    }
                }

                done();
            });
        });
    });

    describe("closest", () => {
        it("must return the closest matching ancestor", done => {
            env("<div class='wrapper' id='main'><span class='foo'>Bar</span></div>", (err, _window) => {
                global.Node = _window.Node;
                expect(err).to.be.null;

                const foo = _window.document.querySelector(".foo");
                const wrapper = _window.document.querySelector(".wrapper");
                const ancestor = dom.closest(foo, ".wrapper");

                expect(ancestor).to.equal(wrapper);

                done();
            });
        });
        it("must return null if no ancestor matches the selector", done => {
            env("<div class='wrapper' id='main'><span class='foo'>Bar</span></div>", (err, _window) => {
                global.Node = _window.Node;
                expect(err).to.be.null;

                const foo = _window.document.querySelector(".foo");
                const ancestor = dom.closest(foo, ".bar");

                expect(ancestor).to.be.null;

                done();
            });
        });
    });
});
