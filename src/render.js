export default (options, sharers, text, rawText) => {
    const refUrl = options.shareUrl || options.document.defaultView.location;

    return "<ul>"
            + sharers.map(sharer => `<li data-share-via="${sharer.name}">${sharer.render.call(sharer, text, rawText, refUrl)}</li>`).join("")
            + "</ul>";
};
