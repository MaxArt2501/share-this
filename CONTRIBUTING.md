How to contribute
=================

In order to make a contribution to this project, you're kindly invited to respect the following guide lines:

* Respect the coding and formatting style: there is a [.eslintrc](.eslintrc) file (for [ESLint](http://eslint.org/)) and a
  [.editorconfig](.editorconfig) file to ease the task.
* There's nothing included for linting SCSS and LESS (yet), so here're a few notes:
  * no "magic numbers" (unless it's `0` or `100%`): define variables with meaningful names instead;
  * use [kebab-case](http://wiki.c2.com/?KebabCase) for variable, attribute and class names;
  * opening curly braces must be placed in the same line, separated by a space;
  * closing curly braces must be placed in new lines, with the same indentation of the corresponding opening braces;
  * no spaces before colons, a single space after;
  * common sense, please.
* Don't change the history of Git branches.
* Use ES2015 syntax for JavaScript code: Rollup and Babel will take care of it.
* If it's testable with the tools already provided by the package, provide tests that cover your code. In particular:
  * use [Mocha](https://mochajs.org/) to organize your tests;
  * use `expect` from [Chai](http://chaijs.com/api/bdd/) to make your assertions;
  * use [jsdom](https://github.com/tmpvar/jsdom) to test code that interacts with the DOM;
  * as jsdom doesn't support some APIs, tests that involve those may wait until I figure out alternative testing approaches;
  * you may also suggest such approaches.
* This package is meant to not have any dependencies.
* Other kinds of dependencies (dev, peer, etc.) can be taken into consideration.
* This package has a *unopinionated*: this means that you shouldn't take decision that developers can easily take to adapt
  the package to their needs.

Thank you and nice coding!
