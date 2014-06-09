
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

    // Ignore links with fewer than three words
    if (normalizeLinkText(element).split(" ").length < 3) {
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
    return spoiler.indexOf(normalizeLinkText(element)) != -1;
}

function extractUnparsedSpoiler(spoiler, element) {
    var spoilText = spoiler.replace(normalizeLinkText(element), "").trim();

    // Ignore "IS:", "AM:" and the like
    spoilText = spoilText.replace(/[A-Z&]+:/, "");

    // Ignore trailing word that ends with a colon
    spoilText = spoilText.replace(/[^\s]+:$/, "");

    // Ignore garbage punctuation at the end
    spoilText = spoilText.replace(/\.[^a-zA-Z]+$/, ".");

    var title = element.innerHTML;
    return {
        title: title,
        spoiler: spoilText
    };
}

function normalizeLinkText(element) {
    var normalized = element.innerHTML;

    // Strip html tags
    normalized = normalized.replace(/<\/?.+?>/g, "");

    // Strip words that look like times
    normalized = normalized.replace(/[0-9]{2}:[0-9]{2}/, "");

    // Turn line breaks into spaces and strip double spaces
    normalized = normalized.replace(/(\r\n|\n|\r)/gm," ").replace(/  +/g, " ");

    return normailzed.trim();
}

function spoil(element, spoiler) {
    element.innerHTML = element.innerHTML + " <font color=red>" + spoiler.spoiler + "</font>";
}

function spoilLinks() {
    $("a").each(
        function(i, element){ 
            var spoiler; 
            if ((spoiler = findSpoiler(element))) { 
                spoil(element, spoiler); 
            } 
        }
    );
}
