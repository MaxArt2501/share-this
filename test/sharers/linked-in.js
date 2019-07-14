/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import { parse } from "url";

import chai, { expect } from "chai";
import { stub, match } from "sinon";
import sinonChai from "sinon-chai";
import { JSDOM } from "jsdom";

import * as linkedInSharer from "../../src/sharers/linked-in.js";

chai.use(sinonChai);

const longText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
        + "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
        + "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

describe("LinkedIn sharer", () => {
    it("must have name 'linked-in'", () => {
        expect(linkedInSharer.name).to.equal("linked-in");
    });

    it("must render a link to LinkedIn", (done) => {
        const html = linkedInSharer.render("foo", "foo", "path/to/whatever");
        const { window } = new JSDOM(html);

        const anchor = window.document.querySelector("a[href^='https://www.linkedin.com/']");
        expect(anchor).to.not.be.null;
        done();
    });

    it("must have a `getText` helper method", () => {
        expect(typeof linkedInSharer.getText).to.equal("function");
    });

    it("must cut the included text to 250 characters", () => {
        const cutText = linkedInSharer.getText(longText);
        expect(cutText.length).to.equal(250);
    });

    describe("`getShareUrl` method", () => {
        it("must have a `getShareUrl` helper method", () => {
            expect(typeof linkedInSharer.getShareUrl).to.equal("function");
        });

        it("must have a `url`, a `summary` and a `mini` parameter in the sharing URL", () => {
            const shareUrl = linkedInSharer.getShareUrl("foo", "path/to/whatever");
            const parsed = parse(shareUrl, true);
            expect(parsed.query).to.eql({ summary: "foo", url: "path/to/whatever", mini: "true" });
        });
    });

    describe("`action` method", () => {
        it("must have a `action` method", () => {
            expect(typeof linkedInSharer.action).to.equal("function");
        });

        it("must prevent the event's default", (done) => {
            const html = linkedInSharer.render("foo", "foo", "path/to/whatever");
            const { window } = new JSDOM(html);

            const event = new window.Event("click");
            const preventStub = stub(event, "preventDefault");
            stub(window, "open").returns({});

            linkedInSharer.action(event, window.document.body);
            expect(preventStub.called).to.be.true;
            done();
        });

        it("must open a new window", (done) => {
            const html = linkedInSharer.render("foo", "foo", "path/to/whatever");
            const { window } = new JSDOM(html);

            const event = new window.Event("click");
            const openStub = stub(window, "open");
            openStub.returns({});

            linkedInSharer.action(event, window.document.body);
            expect(openStub.calledOnce).to.be.true;
            done();
        });

        it("must open a new window named \"share_via_linked_in\"", (done) => {
            const html = linkedInSharer.render("foo", "foo", "path/to/whatever");
            const { window } = new JSDOM(html);

            const event = new window.Event("click");
            const openStub = stub(window, "open");
            openStub.returns({});

            linkedInSharer.action(event, window.document.body);
            expect(openStub).to.have.been.calledWith(match.any, "share_via_linked_in", match.any);
            done();
        });

        it("must open a new window with the link provided by `getShareUrl`", (done) => {
            const html = linkedInSharer.render("foo", "foo", "path/to/whatever");
            const { window } = new JSDOM(html);

            const event = new window.Event("click");
            const openStub = stub(window, "open");
            openStub.returns({});

            const text = linkedInSharer.getText("foo");
            const url = linkedInSharer.getShareUrl(text, "path/to/whatever");

            linkedInSharer.action(event, window.document.body);
            expect(openStub).to.have.been.calledWith(url, match.any, match.any);
            done();
        });

        it("must nullify the popup's `opener` property", (done) => {
            const html = linkedInSharer.render("foo", "foo", "path/to/whatever");
            const { window } = new JSDOM(html);

            const event = new window.Event("click");
            const openStub = stub(window, "open");
            const popup = {};
            openStub.returns(popup);

            linkedInSharer.action(event, window.document.body);
            expect(popup.opener).to.be.null;
            done();
        });
    });
});
