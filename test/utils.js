/* eslint-disable consistent-return, no-undef, no-unused-expressions */
import { expect } from "chai";

import * as utils from "../src/utils";

describe("Package utilities", () => {
    describe("camelize", () => {
        it("must capitalize the first letter of a string", () => {
            expect(utils.camelize("foo")).to.equal("Foo");
            expect(utils.camelize(" unfoo")).to.equal(" unfoo");
        });
        it("must transform dash-separated words in camel case", () => {
            expect(utils.camelize("foo-bar")).to.equal("FooBar");
            expect(utils.camelize("foo-")).to.equal("Foo-");
        });
    });

    describe("findByName", () => {
        it("must return the object with the matching name", () => {
            const item = utils.findByName([
                { name: "foo", value: 5 },
                { name: "bar", value: 42 }
            ], "bar");
            expect(item).to.eql({ name: "bar", value: 42 });
        });
        it("must return undefined if the item is not found", () => {
            const item = utils.findByName([], "foo");
            expect(item).to.be.undefined;
        });
    });
});
