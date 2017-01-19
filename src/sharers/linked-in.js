export function render(text, rawText, refUrl) {
    const shareText = this.getText(text);
    const url = this.getShareUrl(shareText, refUrl);

    return `<a href="${url}" target="_blank" rel="noopener nofollow noreferrer">`
        + "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">"
            + "<path d=\"M13.632 13.635h-2.37V9.922c0-.886-.018-2.025-1.234-2.025-1.235 0-1.424.964"
                + "-1.424 1.96v3.778h-2.37V6H8.51v1.04h.03c.318-.6 1.092-1.233 2.247-1.233 2.4 0 "
                + "2.845 1.58 2.845 3.637v4.188zM3.558 4.955c-.762 0-1.376-.617-1.376-1.377 0-.758"
                + ".614-1.375 1.376-1.375.76 0 1.376.617 1.376 1.375 0 .76-.617 1.377-1.376 1.377z"
                + "m1.188 8.68H2.37V6h2.376v7.635z\" fill=\"currentcolor\"/>"
        + "</svg></a>";
}

const CHAR_LIMIT = 250;
export function getText(text) {
    let chunk = text.trim();
    if (chunk.length > CHAR_LIMIT - 2) {
        chunk = chunk.slice(0, CHAR_LIMIT - 3).trim() + "\u2026";
    }

    return `\u201c${chunk}\u201d`;
}

export function getShareUrl(text, refUrl) {
    return `https://www.linkedin.com/shareArticle?mini=true&summary=${encodeURIComponent(text)}&url=${encodeURIComponent(refUrl)}`;
}

export function action(event, item) {
    event.preventDefault();
    item.ownerDocument.defaultView.open(
        item.firstChild.href,
        "share_via_linked_in",
        "height=440,location=no,menubar=no,scrollbars=no,status=no,toolbar=no,width=640"
    );
}

export const name = "linked-in";
