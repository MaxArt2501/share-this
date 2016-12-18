exports.render = function render(text, rawText, refUrl) {
    const shareText = this.getText(text);
    const url = this.getShareUrl(shareText, refUrl);

    return `<a href="${url}" target="_blank" rel="noopener nofollow noreferrer">T</a>`;
};

exports.getText = function getText(text) {
    let chunk = text.trim();
    if (chunk.length > 116)
        chunk = chunk.slice(0, 116).trim() + "\u2026";

    return `\u201c${chunk}\u201d`;
};

exports.getShareUrl = function getShareUrl(text, refUrl) {
    return `http://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(refUrl)}`;
};

exports.name = "twitter";
