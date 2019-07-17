/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import { parse } from "url";

import { expect } from "chai";
import { JSDOM } from "jsdom";

import * as redditSharer from "../../src/sharers/reddit.js";

const longText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magnat aliqua.";

describe("Reddit sharer", () => {
    it("must have name 'reddit'", () => {
        expect(redditSharer.name).to.equal("reddit");
    });

    it("must render a link to Reddit", () => {
        const html = redditSharer.render("foo", "foo", "path/to/whatever");
        const { window } = new JSDOM(html);

        const anchor = window.document.querySelector("a[href^='https://reddit.com/']");
        expect(anchor).to.not.be.null;
    });

    it("must have a `getText` helper method", () => {
        expect(typeof redditSharer.getText).to.equal("function");
    });

    it("must cut the included text to 120 characters", () => {
        const cutText = redditSharer.getText(longText);
        expect(cutText.length).to.equal(120);
    });

    it("must have a `getShareUrl` helper method", () => {
        expect(typeof redditSharer.getShareUrl).to.equal("function");
    });

    it("must have a `url` and a `title` parameter in the sharing URL", () => {
        const shareUrl = redditSharer.getShareUrl("foo", "path/to/whatever");
        const parsed = parse(shareUrl, true);
        expect(parsed.query).to.eql({ title: "foo", url: "path/to/whatever" });
    });
});
