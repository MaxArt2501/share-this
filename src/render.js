export default (options, sharers, text, rawText) => {
    const refUrl = options.shareUrl || options.document.defaultView.location;

    // eslint-disable-next-line prefer-template
    return "<ul>"
            + sharers.map(sharer => `<li data-share-via="${sharer.name}">${sharer.render.call(sharer, text, rawText, refUrl)}</li>`).join("")
            + "</ul>";
};
