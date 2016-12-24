import { expect } from "chai";
import { env } from "jsdom";

import factory from "../src/core";

describe("Core factory", () => {
  it("must be a factory function", done => {
    expect(factory).to.be.a("function");
    init({}, result => {
      expect(result).to.be.an("object");
      done();
    });
  });
  it("must create an object with an init method", done => {
    init({}, result => {
      expect(result.init).to.be.a("function");
      done();
    });
  });
  it("must create an object with a destroy method", done => {
    init({}, result => {
      expect(result.destroy).to.be.a("function");
      done();
    });
  });
});

const fakeHTML = "<div>Hello, world!</div>";

function init(opts, callback) {
  env(fakeHTML, (err, _window) => {
    expect(err).to.be.null;

    global.document = _window.document;
    const result = factory(opts);
    callback(result);
  });
}


