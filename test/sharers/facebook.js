/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import { parse } from "url";

import chai, { expect } from "chai";
import { stub, match } from "sinon";
import sinonChai from "sinon-chai";
import { JSDOM } from "jsdom";

import * as facebookSharer from "../../src/sharers/facebook.js";

chai.use(sinonChai);

describe("Facebook sharer", () => {
    it("must have name 'facebook'", () => {
        expect(facebookSharer.name).to.equal("facebook");
    });

    it("must render a link to Facebook", () => {
        const html = facebookSharer.render("foo", "foo", "path/to/whatever");
        const { window } = new JSDOM(html);

        const anchor = window.document.querySelector("a[href^='https://www.facebook.com/']");
        expect(anchor).to.not.be.null;
    });

    describe("`getShareUrl` method", () => {
        it("must have a `getShareUrl` helper method", () => {
            expect(typeof facebookSharer.getShareUrl).to.equal("function");
        });

        it("must have a `u` and a `quote` parameter in the sharing URL", () => {
            const shareUrl = facebookSharer.getShareUrl("foo", "path/to/whatever");
            const parsed = parse(shareUrl, true);
            expect(parsed.query).to.eql({ quote: "foo", u: "path/to/whatever" });
        });
    });

    describe("`action` method", () => {
        it("must have a `action` method", () => {
            expect(typeof facebookSharer.action).to.equal("function");
        });

        it("must prevent the event's default", () => {
            const html = facebookSharer.render("foo", "foo", "path/to/whatever");
            const { window } = new JSDOM(html);

            const event = new window.Event("click");
            const preventStub = stub(event, "preventDefault");
            stub(window, "open").returns({});

            facebookSharer.action(event, window.document.body);
            expect(preventStub.called).to.be.true;
        });

        it("must open a new window", () => {
            const html = facebookSharer.render("foo", "foo", "path/to/whatever");
            const { window } = new JSDOM(html);

            const event = new window.Event("click");
            const openStub = stub(window, "open");
            openStub.returns({});

            facebookSharer.action(event, window.document.body);
            expect(openStub.calledOnce).to.be.true;
        });

        it("must open a new window named \"share_via_facebook\"", () => {
            const html = facebookSharer.render("foo", "foo", "path/to/whatever");
            const { window } = new JSDOM(html);
    
            const event = new window.Event("click");
            const openStub = stub(window, "open");
            openStub.returns({});

            facebookSharer.action(event, window.document.body);
            expect(openStub).to.have.been.calledWith(match.any, "share_via_facebook", match.any);
        });

        it("must open a new window with the link provided by `getShareUrl`", () => {
            const html = facebookSharer.render("foo", "foo", "path/to/whatever");
            const { window } = new JSDOM(html);
    
            const event = new window.Event("click");
            const openStub = stub(window, "open");
            openStub.returns({});
            const url = facebookSharer.getShareUrl("foo", "path/to/whatever");

            facebookSharer.action(event, window.document.body);
            expect(openStub).to.have.been.calledWith(url, match.any, match.any);
        });

        it("must nullify the popup's `opener` property", () => {
            const html = facebookSharer.render("foo", "foo", "path/to/whatever");
            const { window } = new JSDOM(html);
    
            const event = new window.Event("click");
            const openStub = stub(window, "open");
            const popup = {};
            openStub.returns(popup);

            facebookSharer.action(event, window.document.body);
            expect(popup.opener).to.be.null;
        });
    });
});
