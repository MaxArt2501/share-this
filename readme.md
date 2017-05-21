share-this
==========

Medium-like text selection sharing without dependencies

[![Version](http://img.shields.io/npm/v/share-this.svg)](https://www.npmjs.org/package/share-this)
[![Build Status](https://travis-ci.org/MaxArt2501/share-this.svg?branch=master)](https://travis-ci.org/MaxArt2501/share-this)
[![License Type](https://img.shields.io/github/license/MaxArt2501/share-this.svg)](https://img.shields.io/github/license/MaxArt2501/share-this.svg)

## Purpose

This lightweight library allows to create a simple interface to share selected text in a page, in the form of a small popover over the selected portion of text.

Features:

* customizable sharing channels ("sharers")
* restriction on selected elements
* customizable CSS classes and stylesheets
* hooks on opening and closing the popover, and on sharing action

All in a tiny library (less than 1.8 KB minified and gzipped, plus less than 0.5 KB for the optional provided style sheet and 0.5-1.3 KB for the sample sharers).

## Installation

Via npm:

```bash
$ npm install --save share-this
```

Via bower:

```bash
$ bower install share-this
```


## Usage

The library is in UMD format, so feel free to use the module loader of your choice:

```javascript
// CommonJS
const shareThis = require("share-this");

// ES6
import shareThis from "share-this";

// AMD
define([ "share-this" ], shareThis => {
    // ...
});

// Global
var shareThis = window.ShareThis;
```

`shareThis` is a factory for text selection sharing functionality:

```javascript
const selectionShare = shareThis({
    selector: "#shareable",
    sharers: mySharerList
});

selectionShare.init();
```

These are the options for the factory:

* `document`: the `Document` object to apply the sharing functionality (default: `document`);
* `popoverClass`: the class name (or names) to be used in the root element of the popover (default: `share-this-popover`);
* `selector`: restricts the shared text to the contents of the elements matching `selector` (default: `"body"`);
* `sharers`: an array of sharing channels (Twitter, Facebook, email...); see later for details;
* `shareUrl`: a reference URL for the shared text (default: the `location` object of the `document` property);
* `transformer`: a function that transforms the extracted selected text (default: a function that trims and collapses whitespaces).

When you're done sharing text, you can call the `destroy` method;

```javascript
selectionShare.destroy();
```

A destroyed sharing object can *not* be `init`ialized again.


## Sharers

A "sharer" is simply an object with just one mandatory method: `render`, that must return the HTML string of the sharing button;
and a `name` property.

### `render(text, rawText, shareUrl)` (mandatory)

This function receives these arguments:

* `text`: the text that should be shared;
* `rawText`: the original selected text content (i.e., not mangled by the `transformer`);
* `shareUrl`: the reference URL to be shared (see the options).

It must return the HTML of the button/link/element that should provide the required sharing functionality.

### `name` (mandatory)

A unique string (among the sharers) that identify the sharer (e.g.: `"twitter"`, `"facebook"`, ...).

### `active(text, rawText)` (optional)

This property could actually be a function (with the above signature) or a boolean, stating if the sharer is enabled (`true`) or not.
If it's a function, it should return a truthy or falsy value, with the same meaning.

### `action(event, item)` (optional)

A function to be called when the user clicks/taps on the sharing button. The `event`'s default is *not* prevented. `item` is the
`<li>` element that wraps the sharer's button.


## Using the sharers

This library provides some default sharers, that could be loaded like this:

```javascript
// CommonJS
const twitterSharer = require("share-this/dist/sharers/twitter");

// ES6
import * as twitterSharer from "share-this/dist/sharers/twitter";

// AMD
define([ "share-this/dist/sharers/twitter" ], twitterSharer => {
    // ...
});

// Global
const twitterSharer = window.ShareThisViaTwitter;
```

Then you can use the sharers of your choice:

```javascript
const selectionShare = shareThis({
    sharers: [ twitterSharer ]
});
```

Note: the `sharers` array should *not* be empty, or nothing will ever happen.

The following are the default basic sharers provided by the package:

Site     | File location               | Name        | Global variable
---------|-----------------------------|-------------|-----------------------
Twitter  | `dist/sharers/twitter.js`   | `twitter`   | `ShareThisViaTwitter`
Facebook | `dist/sharers/facebook.js`  | `facebook`  | `ShareThisViaFacebook`
LinkedIn | `dist/sharers/linked-in.js` | `linked-in` | `ShareThisViaLinkedIn`
Reddit   | `dist/sharers/reddit.js`    | `reddit`    | `ShareThisViaReddit`
Email    | `dist/sharers/email.js`     | `email`     | `ShareThisViaEmail`


## Developer friendly

This library's source code (that can be found in the [src](src/) folder) uses ES2015 profusely, including ES2015 module definition and loading.
This means that, at the moment, its modules can't be `require`d without prior transpilation, but this also mean that this library is ready for
when environments will finally support ES2015 modules.

The `"module"` property is defined in [package.json](package.json) for those module loaders that support it
([Rollup](https://github.com/rollup/rollup), for example, which is also used to bundle the library).

Source files for style sheets are also provided in both [LESS](style/less) and [SCSS](style/scss) form.


## Browser support

* Chrome/Opera
* Firefox 52+ (1)
* Edge
* Safari 5.1+
* Internet Explorer 9+

Notes:

1. Firefox below v52 works *mostly* just fine, but it fails to remove the popover when the selection is modified
   because it lacks support of the [`selectionchange` event](https://developer.mozilla.org/en-US/docs/Web/Events/selectionchange).


## Mobile devices

On mobile browsers, you might not want to have `share-this` to interfere with native sharing features, so you might want it disabled. In order
to it, you might want to do something like this:

```js
if (!window.matchMedia
        || !window.matchMedia("(pointer: coarse)").matches) {
    selectionShare.init();
}
```

(The rationale of this is that the device's primary pointer is "coarse" - that includes touch devices, but also Kinect and WiiMotes - then the
device *probably* features a native sharing interface. See [CanIUse](http://caniuse.com/#feat=css-media-interaction) for details about Interaction
Media Features. If the browser doesn't support `window.matchMedia` altogether, then it's *probably* a PC with a mouse/trackpad, so it's fine to
initialize `share-this`.)

Keep in mind that native sharing features let the *device* do the job, using apps or services installed on it, `share-this` keep this task on the
page, which means it could offer "sharing" capabilities that the device may not have (e.g.: "save to my account's notes" or "pronounce this using
voice synthesis"), so you might want to show *both* native and custom sharing interfaces.


## To do

* More tests (with headless browsers)
* More test coverage
* Fine-tune Babel
* Specific mobile support


## License

MIT @ Massimo Artizzu 2016-2017. See [LICENSE](LICENSE).
