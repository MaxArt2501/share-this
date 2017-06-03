export function getPageScroll(_window) {
    return {
        left: _window.pageXOffset,
        top: _window.pageYOffset
    };
}

let matchFunc;
export function matches(element, selector) {
    if (!matchFunc) matchFunc = getMatchFunctionName(element);
    return element[matchFunc](selector);
}

export function closest(element, selector) {
    let target = element;
    while (target && (target.nodeType !== 1 /* === Node.ELEMENT_NODE */ || !matches(target, selector))) {
        target = target.parentNode;
    }

    return target;
}

// `contains` in IE doesn't work with text nodes
export function contains(ancestor, target) {
    const comparedPositions = ancestor.compareDocumentPosition(target);
    // eslint-disable-next-line no-bitwise
    return !comparedPositions || (comparedPositions & 16 /* === Node.DOCUMENT_POSITION_CONTAINED_BY */) > 0;
}

// eslint-disable-next-line consistent-return
function getMatchFunctionName(element) {
    for (const name of [ "matches", "matchesSelector", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector" ]) {
        if (element[name]) return name;
    }
}
