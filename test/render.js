/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import { expect } from "chai";
import { JSDOM } from "jsdom";

import render from "../src/render.js";

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
    it("must build a list with an item for every sharer", () => {
        const result = render({ document: fakeDocument }, fakeSharers, "example", "example");
        const { window: { document } } = new JSDOM(result);

        expect(document.querySelectorAll("ul > li").length).to.equal(2);

        for (const sharer of fakeSharers) {
            const { name } = sharer;
            const item = document.querySelector("li[data-share-via=" + name + "]");
            expect(item).to.not.be.null;
        }
    });
});
