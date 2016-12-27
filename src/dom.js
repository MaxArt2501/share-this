export function getPageScroll(_document) {
    const left = _document.documentElement.scrollLeft + _document.body.scrollLeft;
    const top = _document.documentElement.scrollTop + _document.body.scrollTop;
    return { left, top };
};

let matchFunc;
export function matches(element, selector) {
    if (!matchFunc) matchFunc = getMatchFunctionName(element);
    return element[matchFunc](selector);
};

export function closest(element, selector) {
    let target = element;
    while (target && (target.nodeType !== Node.ELEMENT_NODE || !matches(target, selector)))
        target = target.parentNode;

    return target;
};

function getMatchFunctionName(element) {
    for (const name of [ "matches", "matchesSelector", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector" ])
        if (typeof element[name] === "function") return name;
}
