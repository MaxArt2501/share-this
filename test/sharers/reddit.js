var url = require("url");

var expect = require("chai").expect;
var jsdom = require("jsdom");

var redditSharer = require("../../dist/sharers/reddit");

var longText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magnat aliqua.";

describe("Reddit sharer", function() {
    it("must have name 'reddit'", function() {
        expect(redditSharer.name).to.equal("reddit");
    });

    it("must render a link to Reddit", function(done) {
        var html = redditSharer.render("foo", "foo", "path/to/whatever");
        jsdom.env(html, function(err, _window) {
            if (err) return done(err);

            var anchor = _window.document.querySelector("a[href^='https://reddit.com/']");
            expect(anchor).to.not.be.null;
            done();
        });
    });

    it("must have a `getText` helper method", function() {
        expect(typeof redditSharer.getText).to.equal("function");
    });

    it("must cut the included text to 120 characters", function() {
        var cutText = redditSharer.getText(longText);
        expect(cutText.length).to.equal(120);
    });

    it("must have a `getShareUrl` helper method", function() {
        expect(typeof redditSharer.getShareUrl).to.equal("function");
    });

    it("must have a `url` and a `title` parameter in the sharing URL", function() {
        var shareUrl = redditSharer.getShareUrl("foo", "path/to/whatever");
        var parsed = url.parse(shareUrl, true);
        expect(parsed.query).to.eql({ title: "foo", url: "path/to/whatever" });
    });
});
