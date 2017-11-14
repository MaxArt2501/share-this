/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import { expect } from "chai";
import { env } from "jsdom";
import { spy } from "sinon";

import factory from "../src/core";

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
    it("must create an object with a redraw method", (done) => {
        init({}, (result) => {
            expect(result.redraw).to.be.a("function");
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
                global.document.defaultView.getSelection = fakeGetSelection;
                const isInitialized = result.init();
                expect(isInitialized).to.be.true;
                done();
            });
        });
        it("must return false if it's been called more than once", (done) => {
            init({}, (result) => {
                global.document.defaultView.getSelection = fakeGetSelection;
                result.init();
                const isInitialized = result.init();
                expect(isInitialized).to.be.false;
                done();
            });
        });
        it("attaches event listeners to window", (done) => {
            env(fakeHTML, (err, _window) => {
                expect(err).to.be.null;

                const spyWindowAddEvent = spy(_window, 'addEventListener');

                global.document = _window.document;
                const result = factory({});
                global.document.defaultView.getSelection = fakeGetSelection;
                result.init();

                expect(spyWindowAddEvent.withArgs("resize"), "addEventListener(resize)").to.have.been.calledOnce;
                expect(spyWindowAddEvent.withArgs("scroll"), "addEventListener(scroll)").to.have.been.calledOnce;
                done();
            });
        });
        it("attaches event listeners to document", (done) => {
            env(fakeHTML, (err, _window) => {
                expect(err).to.be.null;

                const spyDocumentAddEvent = spy(_window.document, 'addEventListener');

                global.document = _window.document;
                const result = factory({});
                global.document.defaultView.getSelection = fakeGetSelection;
                result.init();

                documentEventTypes.forEach(name => expect(spyDocumentAddEvent.withArgs(name), `addEventListener(${name})`).to.have.been.calledOnce);

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
                global.document.defaultView.getSelection = fakeGetSelection;
                result.init();
                const isSuccessful = result.destroy();
                expect(isSuccessful).to.be.true;
                done();
            });
        });
        it("detaches event listeners on window", (done) => {
            env(fakeHTML, (err, _window) => {
                expect(err).to.be.null;

                const spyWindowAddEvent = spy(_window, 'removeEventListener');

                global.document = _window.document;
                const result = factory({});
                global.document.defaultView.getSelection = fakeGetSelection;
                result.init();
                result.destroy();

                expect(spyWindowAddEvent.withArgs("resize"), "removeEventListener(resize)").to.have.been.calledOnce;
                expect(spyWindowAddEvent.withArgs("scroll"), "removeEventListener(scroll)").to.have.been.calledOnce;
                done();
            });
        });
        it("detaches event listeners to document", (done) => {
            env(fakeHTML, (err, _window) => {
                expect(err).to.be.null;

                const spyDocumentAddEvent = spy(_window.document, 'removeEventListener');

                global.document = _window.document;
                const result = factory({});
                global.document.defaultView.getSelection = fakeGetSelection;
                result.init();
                result.destroy();

                documentEventTypes.forEach(name => expect(spyDocumentAddEvent.withArgs(name), `removeEventListener(${name})`).to.have.been.calledOnce);

                done();
            });
        });
    });
    describe("redraw", () => {
        it("must return false if the instance hasn't been initialized", (done) => {
            init({}, (result) => {
                global.document.defaultView.getSelection = null;
                const isSuccessful = result.redraw();
                expect(isSuccessful).to.be.false;
                done();
            });
        });
        it("must return false if the instance has already been destroyed", (done) => {
            init({}, (result) => {
                global.document.defaultView.getSelection = fakeGetSelection;
                result.init();
                result.destroy();
                const isSuccessful = result.redraw();
                expect(isSuccessful).to.be.false;
                done();
            });
        });
        it("must return true if the instance has been initialized", (done) => {
            init({}, (result) => {
                global.document.defaultView.getSelection = fakeGetSelection;
                result.init();
                const isSuccessful = result.redraw();
                expect(isSuccessful).to.be.true;
                done();
            });
        });
    });
});

const fakeHTML = "<div>Hello, world!</div>";

const fakeGetSelection = function getSelection() {
    return {
        getRangeAt(){
            return undefined;
        }
    };
};

const documentEventTypes = [ "selectionchange", "mouseup", "touchend", "touchcancel" ];

function init(opts, callback) {
    env(fakeHTML, (err, _window) => {
        expect(err).to.be.null;

        global.document = _window.document;
        const result = factory(opts);
        callback(result);
    });
}
