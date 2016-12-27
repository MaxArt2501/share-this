import { getPageScroll, matches, closest } from "./dom";
import { findByName } from "./utils";
import { isSelectionForward, getEndLineRect } from "./selection";

export function stylePopup(popup, range, options) {
    const _document = options.document;
    const selection = _document.defaultView.getSelection();
    const isForward = isSelectionForward(selection);
    const endLineRect = getEndLineRect(range, isForward);
    const scroll = getPageScroll(_document);

    const style = popup.style;
    if (isForward) {
        style.right = `${_document.documentElement.clientWidth - endLineRect.right - scroll.left}px`;
    } else {
        style.left = `${scroll.left + endLineRect.left}px`;
    }
    style.width = `${endLineRect.right - endLineRect.left}px`;
    style.top = `${endLineRect.top}px`;
    style.position = "absolute";

    popup.className = options.popupClass;
};

export function popupClick(sharers, event) {
    const item = closest(event.target, "[data-share-via]");
    if (!item) return;

    const via = item.getAttribute("data-share-via");
    const sharer = findByName(sharers, via);
    if (!sharer || typeof sharer.action !== "function") return;

    sharer.action(event);
};

export function lifeCycleFactory(document) {
    return {
        createPopup(sharers) {
            const popup = document.createElement("div");
            popup.addEventListener("click", popupClick.bind(null, sharers));
            return popup;
        },
        attachPopup(popup) {
            document.body.appendChild(popup);
        },
        removePopup(popup) {
            const parent = popup.parentNode;
            if (parent) parent.removeChild(popup);
        }
    };
};
