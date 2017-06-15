var ShareThisViaSpeakers  = (function() {
    var langs = [ "en-US", "en_US", "en-GB", "en_GB", "en" ];
    function findVoice() {
        // Filtering english voices and sorting by the given order
        var localVoices = synth.getVoices().filter(function(voice) {
            return langs.indexOf(voice.lang) >= 0;
        }).sort(function(v1, v2) {
            return langs.indexOf(v1.lang) - langs.indexOf(v2.lang);
        });
        return localVoices[0];
    }

    var synth = window.speechSynthesis;
    return {
        name: "speakers",
        render: function(text, rawText, refUrl) {
            this.text = text;
            return "<a title=\"Share through your speakers!\" href=\"#\">"
                + "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 75 75\">"
                    + "<g stroke=\"currentColor\" stroke-width=\"5\">"
                        + "<path stroke-linejoin=\"round\" fill=\"currentColor\" d=\"M39.39 13.77L22.234 28.605H6V47.7h15.99l17.4 15.05V13.77z\"/>"
                        + "<path d=\"M48.128 49.03c1.93-3.096 3.062-6.74 3.062-10.653 0-3.978-1.164-7.674-3.147-10.8M55.082 20.537c3.695 4.986 5.884 11.157 5.884 17.84 0 6.62-2.15 12.738-5.788 17.7M61.71 62.61c5.267-6.665 8.418-15.08 8.418-24.232 0-9.217-3.192-17.682-8.52-24.368\" fill=\"none\" stroke-linecap=\"round\"/>"
                + "</g></svg></a>";
        },
        active: !!synth,
        action: function(event) {
            event.preventDefault();
            if (this.text) {
                var utterance = new SpeechSynthesisUtterance(this.text);
                var voice = findVoice();
                if (voice) utterance.voice = voice;
                synth.speak(utterance);
            }
        }
    };
})();
