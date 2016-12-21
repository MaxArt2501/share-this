var url = require("url");

var expect = require("chai").expect;
var jsdom = require("jsdom");

var twitterSharer = require("../../dist/sharers/twitter");

var longText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magnat aliqua.";

describe("Twitter sharer", function() {
    it("must have name 'twitter'", function() {
        expect(twitterSharer.name).to.equal("twitter");
    });

    it("must render a link to Twitter", function(done) {
        var html = twitterSharer.render("foo", "foo", "path/to/whatever");
        jsdom.env(html, function(err, _window) {
            if (err) return done(err);

            var anchor = _window.document.querySelector("a[href^='https://twitter.com/']");
            expect(anchor).to.not.be.null;
            done();
        });
    });

    it("must have a `getText` helper method", function() {
        expect(typeof twitterSharer.getText).to.equal("function");
    });

    it("must cut the included text to 120 characters", function() {
        var cutText = twitterSharer.getText(longText);
        expect(cutText.length).to.equal(120);
    });

    it("must have a `getShareUrl` helper method", function() {
        expect(typeof twitterSharer.getShareUrl).to.equal("function");
    });

    it("must have a `url` and a `text` parameter in the sharing URL", function() {
        var shareUrl = twitterSharer.getShareUrl("foo", "path/to/whatever");
        var parsed = url.parse(shareUrl, true);
        expect(parsed.query).to.eql({ text: "foo", url: "path/to/whatever" });
    });
});
