import { parse } from "url";

import { expect } from "chai";
import { env } from "jsdom";

import * as linkedInSharer from "../../dist/sharers/linked-in";

const longText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
        + "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
        + "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

describe("LinkedIn sharer", () => {
    it("must have name 'linked-in'", () => {
        expect(linkedInSharer.name).to.equal("linked-in");
    });

    it("must render a link to LinkedIn", done => {
        const html = linkedInSharer.render("foo", "foo", "path/to/whatever");
        env(html, (err, _window) => {
            if (err) return done(err);

            const anchor = _window.document.querySelector("a[href^='https://www.linkedin.com/']");
            expect(anchor).to.not.be.null;
            done();
        });
    });

    it("must have a `getText` helper method", () => {
        expect(typeof linkedInSharer.getText).to.equal("function");
    });

    it("must cut the included text to 250 characters", () => {
        const cutText = linkedInSharer.getText(longText);
        expect(cutText.length).to.equal(250);
    });

    it("must have a `getShareUrl` helper method", () => {
        expect(typeof linkedInSharer.getShareUrl).to.equal("function");
    });

    it("must have a `url`, a `summary` and a `mini` parameter in the sharing URL", () => {
        const shareUrl = linkedInSharer.getShareUrl("foo", "path/to/whatever");
        const parsed = parse(shareUrl, true);
        expect(parsed.query).to.eql({ summary: "foo", url: "path/to/whatever", mini: "true" });
    });
});
