import { closest, contains } from "./dom.js";

export function isSelectionForward(selection) {
    if (selection.isCollapsed) return true;

    const comparedPositions = selection.anchorNode.compareDocumentPosition(selection.focusNode);
    if (!comparedPositions) {
        // It's the same node
        return selection.anchorOffset < selection.focusOffset;
    }

    // eslint-disable-next-line no-bitwise
    return (comparedPositions & 4 /* === Node.DOCUMENT_POSITION_FOLLOWING */) > 0;
}

export function getEndLineRect(range, isForward) {
    let endLineRects;
    const rangeRects = range.getClientRects();
    const sliceRects = [].slice.bind(rangeRects);

    if (isForward) {
        let lastLeft = Infinity;
        let i = rangeRects.length;
        while (i--) {
            const rect = rangeRects[i];
            if (rect.left > lastLeft) break;
            lastLeft = rect.left;
        }
        endLineRects = sliceRects(i + 1);
    } else {
        let lastRight = -Infinity;
        let i = 0;
        for (; i < rangeRects.length; i++) {
            const rect = rangeRects[i];
            if (rect.right < lastRight) break;
            lastRight = rect.right;
        }
        endLineRects = sliceRects(0, i);
    }

    return {
        top: Math.min(...endLineRects.map(rect => rect.top)),
        bottom: Math.max(...endLineRects.map(rect => rect.bottom)),
        left: endLineRects[0].left,
        right: endLineRects[endLineRects.length - 1].right
    };
}

export function constrainRange(range, selector) {
    const constrainedRange = range.cloneRange();
    if (range.collapsed || !selector) return constrainedRange;

    let ancestor = closest(range.startContainer, selector);
    if (ancestor) {
        if (!contains(ancestor, range.endContainer)) {
            constrainedRange.setEnd(ancestor, ancestor.childNodes.length);
        }
    } else {
        ancestor = closest(range.endContainer, selector);
        if (ancestor) constrainedRange.setStart(ancestor, 0);
        else constrainedRange.collapse();
    }

    return constrainedRange;
}
