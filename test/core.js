/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import { expect } from "chai";
import { JSDOM } from "jsdom";

import factory from "../src/core.js";

describe("Core factory", () => {
    it("must be a factory function", (done) => {
        expect(factory).to.be.a("function");
        init({}, (result) => {
            expect(result).to.be.an("object");
            done();
        });
    });
    it("must create an object with an init method", (done) => {
        init({}, (result) => {
            expect(result.init).to.be.a("function");
            done();
        });
    });
    it("must create an object with a destroy method", (done) => {
        init({}, (result) => {
            expect(result.destroy).to.be.a("function");
            done();
        });
    });
    it("must create an object with a reposition method", (done) => {
        init({}, (result) => {
            expect(result.reposition).to.be.a("function");
            done();
        });
    });
    describe("init", () => {
        it("must return false if the environment doesn't support Selection API", (done) => {
            init({}, (result) => {
                global.document.defaultView.getSelection = null;
                const isInitialized = result.init();
                expect(isInitialized).to.be.false;
                done();
            });
        });
        it("must return true if the instance has been initialized correctly", (done) => {
            init({}, (result) => {
                global.document.defaultView.getSelection = function getSelection() {};
                const isInitialized = result.init();
                expect(isInitialized).to.be.true;
                done();
            });
        });
        it("must return false if it's been called more than once", (done) => {
            init({}, (result) => {
                global.document.defaultView.getSelection = function getSelection() {};
                result.init();
                const isInitialized = result.init();
                expect(isInitialized).to.be.false;
                done();
            });
        });
    });
    describe("destroy", () => {
        it("must return false if the instance hasn't been initialized", (done) => {
            init({}, (result) => {
                const isSuccessful = result.destroy();
                expect(isSuccessful).to.be.false;
                done();
            });
        });
        it("must return true if the instance has been initialized", (done) => {
            init({}, (result) => {
                global.document.defaultView.getSelection = function getSelection() {};
                result.init();
                const isSuccessful = result.destroy();
                expect(isSuccessful).to.be.true;
                done();
            });
        });
    });
    describe("reposition", () => {
        it("must return false if there's no popover in the page", (done) => {
            init({}, (result) => {
                const isSuccessful = result.reposition();
                expect(isSuccessful).to.be.false;
                done();
            });
        });
    });
});

const fakeHTML = "<div>Hello, world!</div>";

function init(opts, callback) {
    const dom = new JSDOM(fakeHTML);
    global.document = dom.window.document;
    const result = factory(opts);
    callback(result);
}
