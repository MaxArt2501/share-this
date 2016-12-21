var url = require("url");

var expect = require("chai").expect;
var jsdom = require("jsdom");

var facebookSharer = require("../../dist/sharers/facebook");

describe("Facebook sharer", function() {
    it("must have name 'facebook'", function() {
        expect(facebookSharer.name).to.equal("facebook");
    });

    it("must render a link to Facebook", function(done) {
        var html = facebookSharer.render("foo", "foo", "path/to/whatever");
        jsdom.env(html, function(err, _window) {
            if (err) return done(err);

            var anchor = _window.document.querySelector("a[href^='https://www.facebook.com/']");
            expect(anchor).to.not.be.null;
            done();
        });
    });

    it("must have a `getShareUrl` helper method", function() {
        expect(typeof facebookSharer.getShareUrl).to.equal("function");
    });

    it("must have a `u` and a `quote` parameter in the sharing URL", function() {
        var shareUrl = facebookSharer.getShareUrl("foo", "path/to/whatever");
        var parsed = url.parse(shareUrl, true);
        expect(parsed.query).to.eql({ quote: "foo", u: "path/to/whatever" });
    });
});
