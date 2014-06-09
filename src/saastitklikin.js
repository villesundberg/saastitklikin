
function parseTweet(i, x) {
    var s = removeBlacklistedWords(x.innerText);
    unparsedSpoilers.push(s);
}

var blacklist = [ 
    "#saastitklikin", "#säästitklikin", "#saeaestitklikin", /http[^\s]+/, "…"
];

function removeBlacklistedWords(tweet) {
    var newtweet = tweet;
    $.each(blacklist, function(i, word) {
               newtweet = newtweet.replace(word, "");
           });
    newtweet = newtweet.replace(/  +?/g, " ");
    newtweet = newtweet.replace(/^ +/g, "");
    return newtweet;
}

$.get("https://twitter.com/saastitklikin", function(a,b,c,d) { 
          $.each($(".ProfileTweet-text", a), parseTweet); 
          spoilLinks();
      }
     );

var unparsedSpoilers = [];

function findSpoiler(element) {

    if (element.innerHTML.trim().split(" ").length < 3) {
        return null;
    }

    var spoiler = null;

    $.each(
        unparsedSpoilers,
        function(i, s) {
            if (matchUnparsedSpoiler(s, element)) {
                spoiler = extractUnparsedSpoiler(s, element);
                return false;   
            }
            return true;
        }
    );
    
    return spoiler;
}

function matchUnparsedSpoiler(spoiler, element) {
    return spoiler.indexOf(element.innerHTML.trim()) != -1;
}

function extractUnparsedSpoiler(spoiler, element) {
    var spoilText = spoiler.replace(element.innerHTML.trim(), "").replace(/[A-Z&]+:/, "").replace(/\.[^a-zA-Z]+$/, ".");
    var title = element.innerHTML;
    return {
        title: title,
        spoiler: spoilText
    };
}

function spoil(element, spoiler) {
    element.innerHTML = element.innerHTML + " <font color=red>" + spoiler.spoiler + "</font>";
}

function spoilLinks() {
    $("a").each(
        function(i, element){ 
            var spoiler; 
            if ((spoiler = findSpoiler(element))) { 
                console.log(spoiler);
                spoil(element, spoiler); 
            } 
        }
    );
}
