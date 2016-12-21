var url = require("url");

var expect = require("chai").expect;
var jsdom = require("jsdom");

var linkedInSharer = require("../../dist/sharers/linked-in");

var longText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
        + "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
        + "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

describe("LinkedIn sharer", function() {
    it("must have name 'linked-in'", function() {
        expect(linkedInSharer.name).to.equal("linked-in");
    });

    it("must render a link to LinkedIn", function(done) {
        var html = linkedInSharer.render("foo", "foo", "path/to/whatever");
        jsdom.env(html, function(err, _window) {
            if (err) return done(err);

            var anchor = _window.document.querySelector("a[href^='https://www.linkedin.com/']");
            expect(anchor).to.not.be.null;
            done();
        });
    });

    it("must have a `getText` helper method", function() {
        expect(typeof linkedInSharer.getText).to.equal("function");
    });

    it("must cut the included text to 250 characters", function() {
        var cutText = linkedInSharer.getText(longText);
        expect(cutText.length).to.equal(250);
    });

    it("must have a `getShareUrl` helper method", function() {
        expect(typeof linkedInSharer.getShareUrl).to.equal("function");
    });

    it("must have a `url`, a `summary` and a `mini` parameter in the sharing URL", function() {
        var shareUrl = linkedInSharer.getShareUrl("foo", "path/to/whatever");
        var parsed = url.parse(shareUrl, true);
        expect(parsed.query).to.eql({ summary: "foo", url: "path/to/whatever", mini: "true" });
    });
});
