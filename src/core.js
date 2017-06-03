import { stylePopover, lifeCycleFactory } from "./popover";
import { constrainRange } from "./selection";
import { extend, isCallable } from "./utils";
import render from "./render";

let _undefined;
const eventTypes = [ "selectionchange", "mouseup", "touchend", "touchcancel" ];

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

    let popover = _undefined;
    let lifeCycle = _undefined;

    return {
        init() {
            if (initialized) return false;

            _document = options.document;
            _getSelection = _document.defaultView.getSelection;
            if (!_getSelection) {
                // eslint-disable-next-line no-console
                console.warn("share-this: Selection API isn't supported");
                return false;
            }

            eventTypes.forEach(addListener);

            lifeCycle = lifeCycleFactory(_document);

            return initialized = true;
        },
        destroy() {
            if (!initialized || destroyed) return false;

            eventTypes.forEach(removeListener);

            killPopover();

            _getSelection = _undefined;
            _document = _undefined;

            return destroyed = true;
        }
    };

    function addListener(type) { _document.addEventListener(type, selectionCheck); }
    function removeListener(type) { _document.removeEventListener(type, selectionCheck); }

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
        const selection = _getSelection();
        const range = selection.rangeCount && selection.getRangeAt(0);
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
            if (popover) killPopover();
            return;
        }
        if (toBeOpened) popover = lifeCycle.createPopover();

        popover.sharers = sharers;
        popover.innerHTML = render(options, sharers, text, rawText);
        stylePopover(popover, range, options);

        if (!toBeOpened) return;

        lifeCycle.attachPopover(popover);

        if (isCallable(options.onOpen)) {
            options.onOpen(popover, text, rawText);
        }
    }

    function killPopover() {
        if (!popover) return;

        lifeCycle.removePopover(popover);
        popover = _undefined;
        if (isCallable(options.onClose)) {
            options.onClose();
        }
    }

    function sharerCheck(text, rawText, sharer) {
        if (isCallable(sharer.active)) {
            return sharer.active(text, rawText);
        }

        if (sharer.active !== _undefined) {
            return sharer.active;
        }

        return true;
    }
};
