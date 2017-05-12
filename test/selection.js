/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
import { env } from "jsdom";

import * as selection from "../src/selection";

chai.use(sinonChai);

describe("Selection methods", () => {
    describe("isSelectionForward", () => {
        it("must return true is the selection is collapsed", () => {
            const isForward = selection.isSelectionForward({ isCollapsed: true });
            expect(isForward).to.be.true;
        });
        it("must return true if the focusNode is after the anchorNode", (done) => {
            env("<span>Anchor node</span><span>Focus node</span>", (err, _window) => {
                const [ anchorNode, focusNode ] = _window.document.body.children;
                const sel = { anchorNode, focusNode };
                const isForward = selection.isSelectionForward(sel);
                expect(isForward).to.be.true;
                done();
            });
        });
        it("must return false if the focusNode is before the anchorNode", (done) => {
            env("<span>Focus node</span><span>Anchor node</span>", (err, _window) => {
                const [ focusNode, anchorNode ] = _window.document.body.children;
                const sel = { anchorNode, focusNode };
                const isForward = selection.isSelectionForward(sel);
                expect(isForward).to.be.false;
                done();
            });
        });
        it("must return true if the anchorNode and focusNode are the same, and anchorOffset is lesser than focusOffset", (done) => {
            env("Lorem ipsum dolor sit amet", (err, _window) => {
                const body = _window.document.body;
                const sel = {
                    anchorNode: body,
                    anchorOffset: 4,
                    focusNode: body,
                    focusOffset: 5
                };
                const isForward = selection.isSelectionForward(sel);
                expect(isForward).to.be.true;
                done();
            });
        });
        it("must return false if the anchorNode and focusNode are the same, and anchorOffset is greater than focusOffset", (done) => {
            env("Lorem ipsum dolor sit amet", (err, _window) => {
                const body = _window.document.body;
                const sel = {
                    anchorNode: body,
                    anchorOffset: 5,
                    focusNode: body,
                    focusOffset: 4
                };
                const isForward = selection.isSelectionForward(sel);
                expect(isForward).to.be.false;
                done();
            });
        });
    });
});
