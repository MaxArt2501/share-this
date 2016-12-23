import { parse } from "url";

import { expect } from "chai";
import { env } from "jsdom";

import * as twitterSharer from "../../dist/sharers/twitter";

const longText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magnat aliqua.";

describe("Twitter sharer", () => {
    it("must have name 'twitter'", () => {
        expect(twitterSharer.name).to.equal("twitter");
    });

    it("must render a link to Twitter", done => {
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

    it("must have a `getShareUrl` helper method", () => {
        expect(typeof twitterSharer.getShareUrl).to.equal("function");
    });

    it("must have a `url` and a `text` parameter in the sharing URL", () => {
        const shareUrl = twitterSharer.getShareUrl("foo", "path/to/whatever");
        const parsed = parse(shareUrl, true);
        expect(parsed.query).to.eql({ text: "foo", url: "path/to/whatever" });
    });
});
