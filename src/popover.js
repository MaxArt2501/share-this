import { getPageScroll, closest } from "./dom";
import { findByName } from "./utils";
import { isSelectionForward, getEndLineRect } from "./selection";

export function stylePopover(popover, range, options) {
    const _document = options.document;
    const selection = _document.defaultView.getSelection();
    const isForward = isSelectionForward(selection);
    const endLineRect = getEndLineRect(range, isForward);
    const scroll = getPageScroll(_document);

    const style = popover.style;
    if (isForward) {
        style.right = `${_document.documentElement.clientWidth - endLineRect.right - scroll.left}px`;
    } else {
        style.left = `${scroll.left + endLineRect.left}px`;
    }
    style.width = `${endLineRect.right - endLineRect.left}px`;
    style.height = `${endLineRect.bottom - endLineRect.top}px`;
    style.top = `${scroll.top + endLineRect.top}px`;
    style.position = "absolute";

    // eslint-disable-next-line no-param-reassign
    popover.className = options.popoverClass;
}

const dataAttribute = "data-share-via";
export function popoverClick(sharers, event) {
    const item = closest(event.target, `[${dataAttribute}]`);
    if (!item) return;

    const via = item.getAttribute(dataAttribute);
    const sharer = findByName(sharers, via);
    if (!sharer || typeof sharer.action !== "function") return;

    sharer.action(event, item);
}

export function lifeCycleFactory(document) {
    return {
        createPopover(sharers) {
            const popover = document.createElement("div");
            popover.addEventListener("click", popoverClick.bind(null, sharers));
            return popover;
        },
        attachPopover(popover) {
            document.body.appendChild(popover);
        },
        removePopover(popover) {
            const parent = popover.parentNode;
            if (parent) parent.removeChild(popover);
        }
    };
}
