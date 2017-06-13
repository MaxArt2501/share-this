var ShareThisViaHackerNews = (function() {
    return {
        name: "hacker-news",
        render: function(text, rawText, refUrl) {
            var url = "https://news.ycombinator.com/submitlink?u=" + encodeURIComponent(refUrl)
                + "&t=" + encodeURIComponent(text);
            return "<a href=\"" + url + "\" target=\"_blank\" rel=\"noopener nofollow noreferrer\" title=\"Share on Hacker News\">"
                + "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\">"
                    + "<path d=\"M1 1H31V31H1V1M2 2V30H30V2H0M8 5L15 18V27H17V18L24 5H22L16 16 10 5\" fill=\"currentcolor\"/>"
                + "</svg></a>";
        }
    };
})();
