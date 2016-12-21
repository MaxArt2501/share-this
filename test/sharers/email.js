var url = require("url");

var expect = require("chai").expect;
var jsdom = require("jsdom");

var emailSharer = require("../../dist/sharers/email");

describe("Email sharer", function() {
    it("must have name 'email'", function() {
        expect(emailSharer.name).to.equal("email");
    });

    it("must render a link with protocol mailto: and no recipient", function(done) {
        var html = emailSharer.render("foo", "foo", "path/to/whatever");
        jsdom.env(html, function(err, _window) {
            if (err) return done(err);

            var anchor = _window.document.querySelector("a[href^='mailto:?']");
            expect(anchor).to.not.be.null;
            done();
        });
    });

    it("must have a `getShareUrl` helper method", function() {
        expect(typeof emailSharer.getShareUrl).to.equal("function");
    });

    it("must have a `body` parameter in the sharing URL", function() {
        var shareUrl = emailSharer.getShareUrl("foo", "path/to/whatever");
        var parsed = url.parse(shareUrl, true);
        expect(parsed.query).to.eql({ body: "foo\n\npath/to/whatever" });
    });
});
