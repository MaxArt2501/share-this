import { expect } from "chai";
import { env } from "jsdom";

import render from "../src/render";

const fakeWindow = {
    location: "http://foo/"
};
const fakeDocument = {
    defaultView: fakeWindow
};
const fakeSharers = [{
    name: "foo",
    render: text => `foo${text}`
}, {
    name: "bar",
    render: text => `BAR${text}`
}];

describe("Rendering engine", () => {
    it("must return a string", () => {
        const result = render({ document: fakeDocument }, [], "foo", "foo");
        expect(result).to.be.a("string");
    });
    it("must build a list with an item for every sharer", done => {
        const result = render({ document: fakeDocument }, fakeSharers, "example", "example");
        env(result, (err, _window) => {
            if (err) {
                return done(err);
            }

            const document = _window.document;
            expect(document.querySelectorAll("ul > li").length).to.equal(2);

            for (const sharer of fakeSharers) {
                const { name } = sharer;
                const item = document.querySelector("li[data-share-via=" + name + "]");
                expect(item).to.not.be.null;
            }

            done();
        });
    });
});
