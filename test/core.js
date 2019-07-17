/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import { expect } from "chai";
import { JSDOM } from "jsdom";

import factory from "../src/core.js";

describe("Core factory", () => {
    it("must be a factory function", () => {
        expect(factory).to.be.a("function");
        const result = init({});
        expect(result).to.be.an("object");
    });
    it("must create an object with an init method", () => {
        const result = init({});
        expect(result.init).to.be.a("function");
    });
    it("must create an object with a destroy method", () => {
        const result = init({});
        expect(result.destroy).to.be.a("function");
    });
    it("must create an object with a reposition method", () => {
        const result = init({});
        expect(result.reposition).to.be.a("function");
    });
    describe("init", () => {
        it("must return false if the environment doesn't support Selection API", () => {
            const result = init({});
            global.document.defaultView.getSelection = null;
            const isInitialized = result.init();
            expect(isInitialized).to.be.false;
        });
        it("must return true if the instance has been initialized correctly", () => {
            const result = init({});
            global.document.defaultView.getSelection = function getSelection() {};
            const isInitialized = result.init();
            expect(isInitialized).to.be.true;
        });
        it("must return false if it's been called more than once", () => {
            const result = init({});
            global.document.defaultView.getSelection = function getSelection() {};
            result.init();
            const isInitialized = result.init();
            expect(isInitialized).to.be.false;
        });
    });
    describe("destroy", () => {
        it("must return false if the instance hasn't been initialized", () => {
            const result = init({});
            const isSuccessful = result.destroy();
            expect(isSuccessful).to.be.false;
        });
        it("must return true if the instance has been initialized", () => {
            const result = init({});
            global.document.defaultView.getSelection = function getSelection() {};
            result.init();
            const isSuccessful = result.destroy();
            expect(isSuccessful).to.be.true;
        });
    });
    describe("reposition", () => {
        it("must return false if there's no popover in the page", () => {
            const result = init({});
            const isSuccessful = result.reposition();
            expect(isSuccessful).to.be.false;
        });
    });
});

const fakeHTML = "<div>Hello, world!</div>";

function init(opts) {
    const dom = new JSDOM(fakeHTML);
    global.document = dom.window.document;
    return factory(opts);
}
