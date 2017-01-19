/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import { parse } from "url";

import chai, { expect } from "chai";
import { stub, match } from "sinon";
import sinonChai from "sinon-chai";
import { env } from "jsdom";

import * as twitterSharer from "../../src/sharers/twitter";

chai.use(sinonChai);

const longText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magnat aliqua.";

describe("Twitter sharer", () => {
    it("must have name 'twitter'", () => {
        expect(twitterSharer.name).to.equal("twitter");
    });

    it("must render a link to Twitter", (done) => {
        const html = twitterSharer.render("foo", "foo", "path/to/whatever");
        env(html, (err, _window) => {
            if (err) return done(err);

            const anchor = _window.document.querySelector("a[href^='https://twitter.com/']");
            expect(anchor).to.not.be.null;
            done();
        });
    });

    it("must have a `getText` helper method", () => {
        expect(typeof twitterSharer.getText).to.equal("function");
    });

    it("must cut the included text to 120 characters", () => {
        const cutText = twitterSharer.getText(longText);
        expect(cutText.length).to.equal(120);
    });

    describe("`getShareUrl`", () => {
        it("must have a `getShareUrl` helper method", () => {
            expect(typeof twitterSharer.getShareUrl).to.equal("function");
        });

        it("must have a `url` and a `text` parameter in the sharing URL", () => {
            const shareUrl = twitterSharer.getShareUrl("foo", "path/to/whatever");
            const parsed = parse(shareUrl, true);
            expect(parsed.query).to.eql({ text: "foo", url: "path/to/whatever" });
        });
    });

    describe("`action` method", () => {
        it("must have a `action` method", () => {
            expect(typeof twitterSharer.action).to.equal("function");
        });

        it("must prevent the event's default", (done) => {
            const html = twitterSharer.render("foo", "foo", "path/to/whatever");
            env(html, (err, _window) => {
                if (err) return done(err);

                const event = new _window.Event("click");
                const preventStub = stub(event, "preventDefault");
                stub(_window, "open").returns({});

                twitterSharer.action(event, _window.document.body);
                expect(preventStub.called).to.be.true;
                done();
            });
        });

        it("must open a new window", (done) => {
            const html = twitterSharer.render("foo", "foo", "path/to/whatever");
            env(html, (err, _window) => {
                if (err) return done(err);

                const event = new _window.Event("click");
                const openStub = stub(_window, "open");
                openStub.returns({});

                twitterSharer.action(event, _window.document.body);
                expect(openStub.calledOnce).to.be.true;
                done();
            });
        });

        it("must open a new window named \"share_via_twitter\"", (done) => {
            const html = twitterSharer.render("foo", "foo", "path/to/whatever");
            env(html, (err, _window) => {
                if (err) return done(err);

                const event = new _window.Event("click");
                const openStub = stub(_window, "open");
                openStub.returns({});

                twitterSharer.action(event, _window.document.body);
                expect(openStub).to.have.been.calledWith(match.any, "share_via_twitter", match.any);
                done();
            });
        });

        it("must open a new window with the link provided by `getShareUrl`", (done) => {
            const html = twitterSharer.render("foo", "foo", "path/to/whatever");
            env(html, (err, _window) => {
                if (err) return done(err);

                const event = new _window.Event("click");
                const openStub = stub(_window, "open");
                openStub.returns({});

                const text = twitterSharer.getText("foo");
                const url = twitterSharer.getShareUrl(text, "path/to/whatever");

                twitterSharer.action(event, _window.document.body);
                expect(openStub).to.have.been.calledWith(url, match.any, match.any);
                done();
            });
        });

        it("must nullify the popup's `opener` property", (done) => {
            const html = twitterSharer.render("foo", "foo", "path/to/whatever");
            env(html, (err, _window) => {
                if (err) return done(err);

                const event = new _window.Event("click");
                const openStub = stub(_window, "open");
                const popup = {};
                openStub.returns(popup);

                twitterSharer.action(event, _window.document.body);
                expect(popup.opener).to.be.null;
                done();
            });
        });
    });
});
