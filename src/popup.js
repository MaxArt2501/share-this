import { getPageScroll, matches, closest } from "./utils";

export function stylePopup(popup, range, options) {
    popup.className = options.popupClass;

    const rects = range.getClientRects();
    const lastRect = rects[rects.length - 1];
    const scroll = getPageScroll(options.document);

    popup.style.position = "absolute";
    popup.style.left = `${scroll.left + lastRect.left + lastRect.width/2}px`;
    popup.style.top = `${scroll.top + lastRect.top}px`;
};

export function popupClick(sharers, event) {
    const item = closest(event.target, "[data-share-via]");
    if (!item) return;

    const via = item.getAttribute("data-share-via");
    const sharer = findSharer(sharers, via);
    if (!sharer || typeof sharer.action !== "function") return;

    sharer.action(event);
};

function findSharer(sharers, name) {
    // I would have used
    //     for (const sharer of sharers)
    //         if (sharer.name === name) return sharer;
    // but transpilers generates A LOT of code in this specific case.
    for (let i = 0; i < sharers.length; i++) {
        if (sharers[i].name === name) return sharers[i];
    }
}
