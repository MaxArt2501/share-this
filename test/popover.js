/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import chai, { expect } from "chai";
import { spy } from "sinon";
import sinonChai from "sinon-chai";
import { env } from "jsdom";

import * as popover from "../src/popover.js";

chai.use(sinonChai);

const fakeHTML = "<ul><li data-share-via=\"foo\">Hello, world!</li></ul>";

describe("Popover methods", () => {
    describe("lifeCycleFactory", () => {
        it("must be a factory function", () => {
            expect(popover.lifeCycleFactory).to.be.a("function");
            const result = popover.lifeCycleFactory(null);
            expect(result).to.be.an("object");
        });
        it("must create an object with a createPopover method", (done) => {
            initLifeCycle((result) => {
                expect(result.createPopover).to.be.a("function");
                done();
            });
        });
        it("must create an object with an attachPopover method", (done) => {
            initLifeCycle((result) => {
                expect(result.attachPopover).to.be.a("function");
                done();
            });
        });
        it("must create an object with a removePopover method", (done) => {
            initLifeCycle((result) => {
                expect(result.removePopover).to.be.a("function");
                done();
            });
        });

        describe("createPopover", () => {
            it("must create a DOM element", (done) => {
                initLifeCycle((result, _window) => {
                    const element = result.createPopover();
                    expect(element instanceof _window.HTMLElement).to.be.true;
                    done();
                });
            });
            it("must attach an onclick event listener to the created element", (done) => {
                let attached = false;
                const fakeElement = {
                    addEventListener(type, fn) {
                        expect(attached).to.be.false;
                        expect(type).to.equal("click");
                        expect(fn).to.be.a("function");
                        attached = true;
                    }
                };
                const fakeDocument = {
                    createElement(tagName) {
                        expect(tagName).to.be.a("string");
                        return fakeElement;
                    }
                };
                const { createPopover } = popover.lifeCycleFactory(fakeDocument);
                const fakePopover = createPopover();
                expect(fakePopover).to.equal(fakeElement);
                done();
            });
        });
        describe("attachPopover", () => {
            it("must append the given element to document.body", (done) => {
                initLifeCycle((result, _window) => {
                    const fakePopover = _window.document.createElement("foo");
                    result.attachPopover(fakePopover);
                    expect(fakePopover.parentNode).to.equal(_window.document.body);
                    done();
                });
            });
        });
        describe("removePopover", () => {
            it("must detach the given element from document.body", (done) => {
                initLifeCycle((result, _window) => {
                    const body = _window.document.body;
                    const fakePopover = body.firstChild;
                    result.removePopover(fakePopover);
                    expect(body.childNodes.length).to.equal(0);
                    expect(fakePopover.parentNode).to.be.null;
                    done();
                });
            });
        });
    });

    describe("popoverClick", () => {
        it("must call the sharer's `action` method", (done) => {
            env(fakeHTML, (err, _window) => {
                const sharer = {
                    name: "foo",
                    action: spy()
                };
                const target = _window.document.body.firstChild.firstChild;
                const event = new _window.Event("click");
                target.dispatchEvent(event);

                popover.popoverClick([ sharer ], event);
                expect(sharer.action).to.be.calledOnce;
                done();
            });
        });
        it("must get out soon if the sharer isn't found", (done) => {
            env(fakeHTML, (err, _window) => {
                const sharer = {
                    name: "bar",
                    action: spy()
                };
                const target = _window.document.body.firstChild.firstChild;
                const event = new _window.Event("click");
                target.dispatchEvent(event);

                popover.popoverClick([ sharer ], event);
                expect(sharer.action).to.not.be.called;
                done();
            });
        });
        it("must get out soon if the element isn't found", (done) => {
            env(fakeHTML, (err, _window) => {
                const sharer = {
                    name: "foo",
                    action: spy()
                };
                const target = _window.document.body.firstChild.firstChild;
                target.removeAttribute("data-share-via");
                const event = new _window.Event("click");
                target.dispatchEvent(event);

                popover.popoverClick([ sharer ], event);
                expect(sharer.action).to.not.be.called;
                done();
            });
        });
    });
});

function initLifeCycle(callback) {
    env(fakeHTML, (err, _window) => {
        expect(err).to.be.null;

        const result = popover.lifeCycleFactory(_window.document);
        callback(result, _window);
    });
}
