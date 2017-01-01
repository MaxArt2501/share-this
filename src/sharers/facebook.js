export function render(text, rawText, refUrl) {
    const url = this.getShareUrl(text, refUrl);

    return `<a href="${url}" target="_blank" rel="noopener nofollow noreferrer">`
        + "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"1.5 1.5 16 16\">"
            + "<path d=\"M8.546 16V9.804H6.46V7.39h2.086V5.607c0-2.066 1.262-3.19 3.106-3.19.883 "
                + "0 1.642.064 1.863.094v2.16h-1.28c-1 0-1.195.48-1.195 1.18v1.54h2.39l-.31 2.42"
                + "h-2.08V16\" fill=\"currentcolor\"/>"
        + "</svg></a>";
}

export function getShareUrl(text, refUrl) {
    return `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}&u=${encodeURIComponent(refUrl)}`;
}

export function action(event, item) {
    event.preventDefault();
    item.ownerDocument.defaultView.open(
        item.firstChild.href,
        "share_via_facebook",
        "height=440,location=no,menubar=no,scrollbars=no,status=no,toolbar=no,width=640"
    );
}

export const name = "facebook";
