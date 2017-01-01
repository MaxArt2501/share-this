import { stylePopover, lifeCycleFactory } from "./popover";
import { constrainRange } from "./selection";
import { extend } from "./utils";
import render from "./render";

let _undefined;

export default opts => {
    const options = extend({
        document,
        selector: "body",
        sharers: [],
        popoverClass: "share-this-popover",
        transformer: raw => raw.trim().replace(/\s+/g, " ")
    }, opts || {});

    let initialized = false;
    let destroyed = false;

    let _window;
    let _document;
    let _selection;

    let popup;
    let sharers;
    let lifeCycle;

    return {
        init() {
            if (initialized || destroyed) return;

            _document = options.document;
            _window = _document.defaultView;
            if (!_window.getSelection) return console.error("Selection API isn't supported");

            const addListener = _document.addEventListener.bind(_document);
            addListener("selectionchange", killPopover);
            addListener("mouseup", selectionCheck);
            addListener("touchend", selectionCheck);

            _selection = _window.getSelection();
            lifeCycle = lifeCycleFactory(_document);

            initialized = true;
        },
        destroy() {
            if (!initialized || destroyed) return;

            const removeListener = _document.removeEventListener.bind(_document);
            removeListener("selectionchange", killPopover);
            removeListener("mouseup", selectionCheck);
            removeListener("touchend", selectionCheck);

            killPopover();
            _selection = _window = _document = null;

            destroyed = true;
        }
    };

    function selectionCheck() {
        const range = _selection.rangeCount && _selection.getRangeAt(0);
        if (!range) return killPopover();
        const constrainedRange = constrainRange(range, options.selector);
        if (constrainedRange.collapsed) return killPopover();

        drawPopover(constrainedRange);
    }

    function drawPopover(range) {
        if (popover) return;

        const rawText = range.toString();
        const text = options.transformer(rawText);

        sharers = options.sharers.filter(sharerCheck.bind(null, text, rawText));
        if (!sharers.length) return;

        popover = lifeCycle.createPopover(sharers);
        popover.innerHTML = render(options, sharers, text, rawText);
        stylePopover(popover, range, options);
        lifeCycle.attachPopover(popover);

        if (typeof options.onOpen === "function")
            options.onOpen(popover, text, rawText);
    }

    function killPopover() {
        if (!popover) return;

        lifeCycle.removePopover(popover);
        popover = sharers = null;
        if (typeof options.onClose === "function")
            options.onClose();
    }

    function sharerCheck(text, rawText, sharer) {
        if (typeof sharer.active === "function")
            return sharer.active(text, rawText);

        if (sharer.active !== _undefined)
            return sharer.active;

        return true;
    }
};
