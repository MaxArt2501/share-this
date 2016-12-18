share-this
==========

Medium-like text selection sharing without dependencies

## Purpose

This lightweight library allows to create a simple interface to share selected text in a page, in the form of a small popup over the selected portion of text.

Features:

* customizable sharing channels ("sharers")
* restriction on selected elements
* customizable CSS classes and stylesheets
* hooks on opening and closing the popup, and on sharing action

## Installation

Via npm (soon):

```bash
$ npm install --save share-this
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

`shareThis` is a factory for selected text sharing functionality:

```javascript
const selectionShare = shareThis({
    selector: "#shareable",
    sharers: mySharerList
});

selectionShare.init();
```

These are the options for the factory:

* `document`: the `Document` object to apply the sharing functionality (default: `document`);
* `popupClass`: the class name (or names) to be used in the root element of the popup (default: `share-this-popup`);
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

### `action(event)` (optional)

A function to be called when the user clicks/taps on the sharing button. The `event`'s default is *not* prevented.


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

## License

MIT @ Massimo Artizzu 2016. See [LICENSE](LICENSE).
