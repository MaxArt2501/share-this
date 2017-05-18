import { stylePopover, lifeCycleFactory } from "./popover";
import { constrainRange } from "./selection";
import { extend } from "./utils";
import render from "./render";

let _undefined;

export default (opts) => {
    const options = (Object.assign || extend)({
        document,
        selector: "body",
        sharers: [],
        popoverClass: "share-this-popover",
        transformer: raw => raw.trim().replace(/\s+/g, " ")
    }, opts || {});

    let initialized = false;
    let destroyed = false;

    let _window = _undefined;
    let _document = _undefined;
    let _selection = _undefined;

    let popover = _undefined;
    let lifeCycle = _undefined;

    return {
        init() {
            if (initialized) return false;

            _document = options.document;
            _window = _document.defaultView;
            if (!_window.getSelection) {
                // eslint-disable-next-line no-console
                console.error("Selection API isn't supported");
                return false;
            }

            const addListener = _document.addEventListener.bind(_document);
            addListener("selectionchange", killPopover);
            addListener("mouseup", selectionCheck);
            addListener("touchend", selectionCheck);

            _selection = _window.getSelection();
            lifeCycle = lifeCycleFactory(_document);

            return initialized = true;
        },
        destroy() {
            if (!initialized || destroyed) return false;

            const removeListener = _document.removeEventListener.bind(_document);
            removeListener("selectionchange", killPopover);
            removeListener("mouseup", selectionCheck);
            removeListener("touchend", selectionCheck);

            killPopover();

            _selection = null;
            _window = null;
            _document = null;

            return destroyed = true;
        }
    };

    function selectionCheck() {
        const range = _selection.rangeCount && _selection.getRangeAt(0);
        if (!range) {
            killPopover();
            return;
        }

        const constrainedRange = constrainRange(range, options.selector);
        if (constrainedRange.collapsed) {
            killPopover();
            return;
        }

        drawPopover(constrainedRange);
    }

    function drawPopover(range) {
        if (popover) return;

        const rawText = range.toString();
        const text = options.transformer(rawText);

        const sharers = options.sharers.filter(sharerCheck.bind(null, text, rawText));
        if (!sharers.length) return;

        popover = lifeCycle.createPopover(sharers);
        popover.innerHTML = render(options, sharers, text, rawText);
        stylePopover(popover, range, options);
        lifeCycle.attachPopover(popover);

        if (typeof options.onOpen === "function") {
            options.onOpen(popover, text, rawText);
        }
    }

    function killPopover() {
        if (!popover) return;

        lifeCycle.removePopover(popover);
        popover = null;
        if (typeof options.onClose === "function") {
            options.onClose();
        }
    }

    function sharerCheck(text, rawText, sharer) {
        if (typeof sharer.active === "function") {
            return sharer.active(text, rawText);
        }

        if (sharer.active !== _undefined) {
            return sharer.active;
        }

        return true;
    }
};
