ShareThis({
    sharers: [ ShareThisViaTwitter, ShareThisViaHackerNews, ShareThisViaReddit, ShareThisViaNotes, ShareThisViaSpeakers ],
    selector: "article"
}).init();

(function() {
    var avatar = document.querySelector(".random-avatar");
    function setRandomAvatar() {
        var random = (Math.random() * 1e12).toString(36);
        avatar.src = "https://api.adorable.io/avatars/32/" + random + ".png";
        avatar.classList.add("loading");
    }
    function endAvatarLoad() {
        avatar.classList.remove("loading");
    }
    avatar.addEventListener("load", endAvatarLoad);
    avatar.addEventListener("error", endAvatarLoad);
    setRandomAvatar();

    function resetAudio(audio) {
        if (audio.paused) audio.play();
        else audio.currentTime = 0;
    }
    function resetAnimation(element, klass) {
        element.classList.remove(klass);
        setTimeout(function() {
            element.classList.add(klass);
        }, 0);
    }

    var boingAudio = document.createElement("audio");
    // From https://freesound.org/people/InspectorJ/sounds/345689/
    boingAudio.src = "boing.mp3";
    avatar.addEventListener("click", function() {
        if (avatar.classList.contains("loading")) return;
        setRandomAvatar();
        resetAudio(boingAudio);
    });

    var bell = document.querySelector(".bell-icon");
    var dingAudio = document.createElement("audio");
    // From https://freesound.org/people/KeyKrusher/sounds/173000/
    dingAudio.src = "ding.mp3";

    bell.addEventListener("click", function() {
        resetAnimation(bell, "oscillating");
        resetAudio(dingAudio);
    });

    var heart = document.querySelector(".heart-icon");
    var beatAudio = document.createElement("audio");
    // From https://freesound.org/people/morganpurkis/sounds/390429/
    beatAudio.src = "beat.mp3";

    heart.addEventListener("click", function() {
        resetAnimation(heart, "beating");
        resetAudio(beatAudio);
    });

    var search = document.querySelector(".search-icon");
    var crashAudio = document.createElement("audio");
    // From https://freesound.org/people/natemarler/sounds/338692/
    crashAudio.src = "crash.mp3";

    search.addEventListener("click", function() {
        if (search.classList.contains("crashing")) return;
        search.classList.add("crashing");
        resetAudio(crashAudio);
    });
    search.addEventListener("animationend", function() {
        search.classList.remove("crashing");
    });
})();
