/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import { expect } from "chai";
import { env } from "jsdom";

import * as dom from "../src/dom";

const fakeWindow = {
    getComputedStyle() {
        return { position: "relative" };
    },
    document: {
        body: {
            getBoundingClientRect() {
                return {
                    top: -100,
                    left: -50
                };
            }
        }
    }
};

describe("DOM utilities", () => {
    describe("getOffsetScroll", () => {
        it("must return an object with `left` and `top` numeric properties", () => {
            const scroll = dom.getOffsetScroll(fakeWindow);
            expect(scroll).to.be.an("object");
            expect(scroll.left).to.be.a("number");
            expect(scroll.top).to.be.a("number");
        });
        it("must return the normalized top and left scroll of the page", () => {
            const scroll = dom.getOffsetScroll(fakeWindow);
            expect(scroll).to.include({ top: -100, left: -50 });
        });
    });

    describe("matches", () => {
        it("must work like `Element.prototype.matches`", (done) => {
            env("<div class='wrapper' id='main'><span class='foo'>Bar</span></div>", (err, _window) => {
                expect(err).to.be.null;

                const selectorMatches = {
                    ".foo": ".wrapper > span",
                    span: "#main > span",
                    "#main": "main"
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
        it("must return the closest matching ancestor", (done) => {
            env("<div class='wrapper' id='main'><span class='foo'>Bar</span></div>", (err, _window) => {
                expect(err).to.be.null;

                const foo = _window.document.querySelector(".foo");
                const wrapper = _window.document.querySelector(".wrapper");
                const ancestor = dom.closest(foo, ".wrapper");

                expect(ancestor).to.equal(wrapper);

                done();
            });
        });
        it("must return null if no ancestor matches the selector", (done) => {
            env("<div class='wrapper' id='main'><span class='foo'>Bar</span></div>", (err, _window) => {
                expect(err).to.be.null;

                const foo = _window.document.querySelector(".foo");
                const ancestor = dom.closest(foo, ".bar");

                expect(ancestor).to.be.null;

                done();
            });
        });
    });

    describe("contains", () => {
        it("must return true if and only if the ancestor contains the target or it's the same node", (done) => {
            env("<div class='wrapper' id='main'><span class='foo'>Bar</span></div>", (err, _window) => {
                expect(err).to.be.null;

                const target = _window.document.querySelector(".foo");
                const ancestor = _window.document.querySelector(".wrapper");

                expect(dom.contains(ancestor, target)).to.be.true;
                expect(dom.contains(ancestor, ancestor)).to.be.true;
                expect(dom.contains(ancestor, _window.document.body)).to.be.false;

                done();
            });
        });
        it("must work with any kind of node", (done) => {
            env("<div class='wrapper' id='main'><span class='foo'>Bar</span><!-- A comment --></div>", (err, _window) => {
                expect(err).to.be.null;

                const target = _window.document.querySelector(".foo");
                const text = target.firstChild;
                const ancestor = _window.document.querySelector(".wrapper");
                const comment = ancestor.lastChild;

                expect(dom.contains(ancestor, text)).to.be.true;
                expect(dom.contains(ancestor, comment)).to.be.true;

                done();
            });
        });
    });
});
