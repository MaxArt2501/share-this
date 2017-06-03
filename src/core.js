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

    let _getSelection = _undefined;
    let _document = _undefined;
    let _selection = _undefined;

    let popover = _undefined;
    let lifeCycle = _undefined;

    return {
        init() {
            if (initialized) return false;

            _document = options.document;
            _getSelection = _document.defaultView.getSelection;
            if (!_getSelection) {
                // eslint-disable-next-line no-console
                console.error("Selection API isn't supported");
                return false;
            }

            const addListener = _document.addEventListener.bind(_document);
            addListener("selectionchange", selectionCheck);
            addListener("mouseup", selectionCheck);
            addListener("touchend", selectionCheck);
            addListener("touchcancel", selectionCheck);

            _selection = _getSelection();
            lifeCycle = lifeCycleFactory(_document);

            return initialized = true;
        },
        destroy() {
            if (!initialized || destroyed) return false;

            const removeListener = _document.removeEventListener.bind(_document);
            removeListener("selectionchange", selectionCheck);
            removeListener("mouseup", selectionCheck);
            removeListener("touchend", selectionCheck);
            removeListener("touchcancel", selectionCheck);

            killPopover();

            _getSelection = _undefined;
            _document = _undefined;
            _selection = _undefined;

            return destroyed = true;
        }
    };

    function selectionCheck({ type }) {
        const shouldHavePopover = type === "selectionchange";
        if (!popover !== shouldHavePopover) {
            // Safari iOS fires selectionchange *before* click, so tapping on a sharer would be prevented
            setTimeout(() => {
                const range = getConstrainedRange();
                if (range) drawPopover(range);
                else killPopover();
            }, 10);
        }
    }

    function getConstrainedRange() {
        const range = _selection.rangeCount && _selection.getRangeAt(0);
        if (!range) return;

        const constrainedRange = constrainRange(range, options.selector);
        if (constrainedRange.collapsed) return;

        // eslint-disable-next-line consistent-return
        return constrainedRange;
    }

    function drawPopover(range) {
        const toBeOpened = !popover;
        const rawText = range.toString();
        const text = options.transformer(rawText);
        const sharers = options.sharers.filter(sharerCheck.bind(null, text, rawText));

        if (!sharers.length) {
            if (!toBeOpened) killPopover();
            return;
        }
        if (toBeOpened) popover = lifeCycle.createPopover();

        popover.sharers = sharers;
        popover.innerHTML = render(options, sharers, text, rawText);
        stylePopover(popover, range, options);

        if (!toBeOpened) return;

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
