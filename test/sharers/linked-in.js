/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import { parse } from "url";

import chai, { expect } from "chai";
import { stub, match } from "sinon";
import sinonChai from "sinon-chai";
import { JSDOM } from "jsdom";

import * as linkedInSharer from "../../src/sharers/linked-in";

chai.use(sinonChai);

describe("LinkedIn sharer", () => {
    it("must have name 'linked-in'", () => {
        expect(linkedInSharer.name).to.equal("linked-in");
    });

    it("must render a link to LinkedIn", () => {
        const html = linkedInSharer.render("", "", "path/to/whatever");
        const { window } = new JSDOM(html);
        const anchor = window.document.querySelector("a[href^='https://www.linkedin.com/']");
        expect(anchor).to.not.be.null;
    });

    describe("`getShareUrl` method", () => {
        it("must have a `getShareUrl` helper method", () => {
            expect(typeof linkedInSharer.getShareUrl).to.equal("function");
        });

        it("must have a `url` parameter in the sharing URL", () => {
            const shareUrl = linkedInSharer.getShareUrl("path/to/whatever");
            const parsed = parse(shareUrl, true);
            expect(parsed.query).to.eql({ url: "path/to/whatever" });
        });
    });

    describe("`action` method", () => {
        it("must have a `action` method", () => {
            expect(typeof linkedInSharer.action).to.equal("function");
        });

        it("must prevent the event's default", () => {
            const html = linkedInSharer.render("", "", "path/to/whatever");
            const { window } = new JSDOM(html);
            const event = new window.Event("click");
            const preventStub = stub(event, "preventDefault");
            stub(window, "open").returns({});

            linkedInSharer.action(event, window.document.body);
            expect(preventStub.called).to.be.true;
        });

        it("must open a new window", () => {
            const html = linkedInSharer.render("", "", "path/to/whatever");
            const { window } = new JSDOM(html);
            const event = new window.Event("click");
            const openStub = stub(window, "open");
            openStub.returns({});

            linkedInSharer.action(event, window.document.body);
            expect(openStub.calledOnce).to.be.true;
        });

        it("must open a new window named \"share_via_linked_in\"", () => {
            const html = linkedInSharer.render("", "", "path/to/whatever");
            const { window } = new JSDOM(html);
            const event = new window.Event("click");
            const openStub = stub(window, "open");
            openStub.returns({});

            linkedInSharer.action(event, window.document.body);
            expect(openStub).to.have.been.calledWith(match.any, "share_via_linked_in", match.any);
        });

        it("must open a new window with the link provided by `getShareUrl`", () => {
            const html = linkedInSharer.render("", "", "path/to/whatever");
            const { window } = new JSDOM(html);
            const event = new window.Event("click");
            const openStub = stub(window, "open");
            openStub.returns({});

            const url = linkedInSharer.getShareUrl("path/to/whatever");

            linkedInSharer.action(event, window.document.body);
            expect(openStub).to.have.been.calledWith(url, match.any, match.any);
        });

        it("must nullify the popup's `opener` property", () => {
            const html = linkedInSharer.render("", "", "path/to/whatever");
            const { window } = new JSDOM(html);
            const event = new window.Event("click");
            const openStub = stub(window, "open");
            const popup = {};
            openStub.returns(popup);

            linkedInSharer.action(event, window.document.body);
            expect(popup.opener).to.be.null;
        });
    });
});
