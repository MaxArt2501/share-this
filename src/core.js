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
    let scrollHandlerTicking = false;

    let _document = _undefined;
    let _window = _undefined;

    let popover = _undefined;
    let lifeCycle = _undefined;

    function addListener(type) { _document.addEventListener(type, selectionCheck); }
    function removeListener(type) { _document.removeEventListener(type, selectionCheck); }

    const resizeHandler = () => {
        if (popover) {
            stylePopover(popover, getConstrainedRange(), options);
        }
    };

    const scrollHandler = () => {
        if (!scrollHandlerTicking) {
            // non-blocking event handling
            window.requestAnimationFrame(() => {
                if (popover) {
                    stylePopover(popover, getConstrainedRange(), options);
                    scrollHandlerTicking = false;
                }
            });
            scrollHandlerTicking = true;
        }
    };

    const selectionCheck = ({ type }) => {
        const shouldHavePopover = type === "selectionchange";
        if (!popover !== shouldHavePopover) {
            // Safari iOS fires selectionchange *before* click, so tapping on a sharer would be prevented
            setTimeout(() => {
                const range = getConstrainedRange();
                if (range) drawPopover(range);
                else killPopover();
            }, 10);
        }
    };

    const getConstrainedRange = () => {
        const selection = _window.getSelection();
        const range = selection.rangeCount && selection.getRangeAt(0);
        if (!range) return;

        const constrainedRange = constrainRange(range, options.selector);
        if (constrainedRange.collapsed || !constrainedRange.getClientRects().length) return;

        // eslint-disable-next-line consistent-return
        return constrainedRange;
    };

    const drawPopover = (range) => {
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
    };

    const killPopover = () => {
        if (!popover) return;

        lifeCycle.removePopover(popover);
        popover = _undefined;
        if (isCallable(options.onClose)) {
            options.onClose();
        }
    };

    const sharerCheck = (text, rawText, sharer) => {
        const active = sharer.active;
        if (isCallable(active)) {
            return active(text, rawText);
        }

        if (active !== _undefined) {
            return active;
        }

        return true;
    };

    return {
        init: () => {
            if (initialized) return false;

            _document = options.document;
            _window = _document.defaultView;
            if (!_window.getSelection) {
                // eslint-disable-next-line no-console
                console.warn("share-this: Selection API isn't supported");
                return false;
            }

            eventTypes.forEach(addListener);
            _window.addEventListener("resize", resizeHandler, { passive: true });
            _window.addEventListener("scroll", scrollHandler, { passive: true });

            lifeCycle = lifeCycleFactory(_document);

            return initialized = true;
        },
        destroy: () => {
            if (!initialized || destroyed) return false;

            eventTypes.forEach(removeListener);
            _window.removeEventListener("resize", resizeHandler);
            _window.removeEventListener("scroll", scrollHandler);

            killPopover();

            _document = _undefined;
            _window = _undefined;

            return destroyed = true;
        },
        redraw: () => {
            if (!initialized || destroyed) return false;

            const range = getConstrainedRange();
            if (range) drawPopover(range);
            else killPopover();

            return true;
        }
    };
};
