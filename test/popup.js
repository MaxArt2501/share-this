import { expect } from "chai";
import { env } from "jsdom";

import * as popup from "../src/popup";

describe("Popup methods", () => {
    describe("lifeCycleFactory", () => {
        it("must be a factory function", () => {
            expect(popup.lifeCycleFactory).to.be.a("function");
            const result = popup.lifeCycleFactory(null);
            expect(result).to.be.an("object");
        });
        it("must create an object with a createPopup method", done => {
            initLifeCycle(result => {
                expect(result.createPopup).to.be.a("function");
                done();
            });
        });
        it("must create an object with an attachPopup method", done => {
            initLifeCycle(result => {
                expect(result.attachPopup).to.be.a("function");
                done();
            });
        });
        it("must create an object with a removePopup method", done => {
            initLifeCycle(result => {
                expect(result.removePopup).to.be.a("function");
                done();
            });
        });

        describe("createPopup", () => {
            it("must create a DOM element", done => {
                initLifeCycle((result, _window) => {
                    const element = result.createPopup();
                    expect(element instanceof _window.HTMLElement).to.be.true;
                    done();
                });
            });
            it("must attach an onclick event listener to the created element", done => {
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
                const { createPopup } = popup.lifeCycleFactory(fakeDocument);
                const fakePopup = createPopup();
                expect(fakePopup).to.equal(fakeElement);
                done();
            });
        });
        describe("attachPopup", () => {
            it("must append the given element to document.body", done => {
                initLifeCycle((result, _window) => {
                    const fakePopup = _window.document.createElement("foo");
                    result.attachPopup(fakePopup);
                    expect(fakePopup.parentNode).to.equal(_window.document.body);
                    done();
                });
            });
        });
        describe("removePopup", () => {
            it("must detach the given element from document.body", done => {
                initLifeCycle((result, _window) => {
                    const body = _window.document.body;
                    const fakePopup = body.firstChild;
                    result.removePopup(fakePopup);
                    expect(body.childNodes.length).to.equal(0);
                    expect(fakePopup.parentNode).to.be.null;
                    done();
                });
            });
        });
    });
});

const fakeHTML = "<div>Hello, world!</div>";

function initLifeCycle(callback) {
    env(fakeHTML, (err, _window) => {
        expect(err).to.be.null;

        const result = popup.lifeCycleFactory(_window.document);
        callback(result, _window);
    });
}
