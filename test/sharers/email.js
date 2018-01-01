/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import { parse } from "url";

import { expect } from "chai";
import { env } from "jsdom";

import * as emailSharer from "../../src/sharers/email.js";

describe("Email sharer", () => {
    it("must have name 'email'", () => {
        expect(emailSharer.name).to.equal("email");
    });

    it("must render a link with protocol mailto: and no recipient", (done) => {
        const html = emailSharer.render("foo", "foo", "path/to/whatever");
        env(html, (err, _window) => {
            if (err) return done(err);

            const anchor = _window.document.querySelector("a[href^='mailto:?']");
            expect(anchor).to.not.be.null;
            done();
        });
    });

    it("must have a `getShareUrl` helper method", () => {
        expect(typeof emailSharer.getShareUrl).to.equal("function");
    });

    it("must have a `body` parameter in the sharing URL", () => {
        const shareUrl = emailSharer.getShareUrl("foo", "path/to/whatever");
        const parsed = parse(shareUrl, true);
        expect(parsed.query).to.eql({ body: "foo\n\npath/to/whatever" });
    });
});
