/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import { expect } from "chai";
import { JSDOM } from "jsdom";

import * as selection from "../src/selection.js";

describe("Selection methods", () => {
    describe("isSelectionForward", () => {
        it("must return true is the selection is collapsed", () => {
            const isForward = selection.isSelectionForward({ isCollapsed: true });
            expect(isForward).to.be.true;
        });
        it("must return true if the focusNode is after the anchorNode", (done) => {
            const { window } = new JSDOM("<span>Anchor node</span><span>Focus node</span>");
            const [ anchorNode, focusNode ] = window.document.body.children;
            const sel = { anchorNode, focusNode };
            const isForward = selection.isSelectionForward(sel);
            expect(isForward).to.be.true;
            done();
        });
        it("must return false if the focusNode is before the anchorNode", (done) => {
            const { window } = new JSDOM("<span>Focus node</span><span>Anchor node</span>");
            const [ focusNode, anchorNode ] = window.document.body.children;
            const sel = { anchorNode, focusNode };
            const isForward = selection.isSelectionForward(sel);
            expect(isForward).to.be.false;
            done();
        });
        it("must return true if the anchorNode and focusNode are the same, and anchorOffset is lesser than focusOffset", (done) => {
            const { window } = new JSDOM("Lorem ipsum dolor sit amet");
            const body = window.document.body;
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
        it("must return false if the anchorNode and focusNode are the same, and anchorOffset is greater than focusOffset", (done) => {
            const { window } = new JSDOM("Lorem ipsum dolor sit amet");
            const body = window.document.body;
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
