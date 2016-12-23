import { parse } from "url";

import { expect } from "chai";
import { env } from "jsdom";

import * as facebookSharer from "../../dist/sharers/facebook";

describe("Facebook sharer", () => {
    it("must have name 'facebook'", () => {
        expect(facebookSharer.name).to.equal("facebook");
    });

    it("must render a link to Facebook", done => {
        const html = facebookSharer.render("foo", "foo", "path/to/whatever");
        env(html, (err, _window) => {
            if (err) return done(err);

            const anchor = _window.document.querySelector("a[href^='https://www.facebook.com/']");
            expect(anchor).to.not.be.null;
            done();
        });
    });

    it("must have a `getShareUrl` helper method", () => {
        expect(typeof facebookSharer.getShareUrl).to.equal("function");
    });

    it("must have a `u` and a `quote` parameter in the sharing URL", () => {
        const shareUrl = facebookSharer.getShareUrl("foo", "path/to/whatever");
        const parsed = parse(shareUrl, true);
        expect(parsed.query).to.eql({ quote: "foo", u: "path/to/whatever" });
    });
});
