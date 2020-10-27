const shouldHideSpamJobs = true; // Should I hide blacklisted jobs?
const shouldHighlightBestJobs = true; // Should I highlight jobs that have whitelisted keywords?
const shouldHighlightFewBids = false; // Should I highlight jobs with few bids?
const shouldHideTooManyBids = true;  // Should I hide jobs with too many bids?

const bidsToHighlightLimit = 15; // Jobs with <15 bids will be highlighted with red
const bidsToHideLimit = 30; // Jobs with >45 bids will be hidden, because they're overcrowded anyway

// Blacklisted keywords
const blacklistKeywords = [

    // These phrases are often used in spam
    "I need you to design and build",
    "same to same",
    "look same like",
    "build me",
    "I want someone to",
    "like http",
    "similar website like",
    ".ml",
    ".in",
    ".xyz/",

    // These keywords are used to exclude projects that are not for me, because freelance.com's filter doesn't function well
    "Shopify",
    "magento",
    "react",
    "angular",
    "payment",
    "chat bot",
    "Troubleshooting",
    "Administrator",
    "CRM",
    "PHP developer",
    "SEO expert",
    "Web Scraper",
    "casino",
    "gambling",
    "blogspot",
    "android",
    "ios",
    "devops",
    "laravel",
    "clickfunnel",
    "xero",
    "android",
    "django",

];


// Keywords that should be highlighted so I can see the best jobs right away
const whilelistKeywords = [
    "wordpress",
]


// Helper fucntion, helps to extract an substring integer from a string
function extractNumFromString(string) { 
    var str = string; 
    var matches = str.match(/(\d+)/);
    if (matches) { 
        return matches[0];
    }
    return 0; // return zero if no integer found in the string
}


// Helper fucntion, get a closest parent with a class
var getClosestParent = function (elem, selector) {

	// Element.matches() polyfill
	if (!Element.prototype.matches) {
	    Element.prototype.matches =
	        Element.prototype.matchesSelector ||
	        Element.prototype.mozMatchesSelector ||
	        Element.prototype.msMatchesSelector ||
	        Element.prototype.oMatchesSelector ||
	        Element.prototype.webkitMatchesSelector ||
	        function(s) {
	            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
	                i = matches.length;
	            while (--i >= 0 && matches.item(i) !== this) {}
	            return i > -1;
	        };
	}

	// Get the closest matching element
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if ( elem.matches( selector ) ) return elem;
	}
	return null;

};



// Removes jobs that I don't want to see
const hideAllSpam = function(){

    let allDescrs = document.querySelectorAll('.info-card-description, .info-card-title');

    allDescrs.forEach(function(item){

        let parent = item.parentNode;
        let grandParent = parent.parentNode;

        let text = item.textContent.toLowerCase();

        blacklistKeywords.forEach(function(word){
            if( text.includes(word.toLowerCase()) ){
                grandParent.style.display = "none";
                // console.log("Hidden by keyword: ", word);
            }
        });

    });

};



// Highlight jobs that contain witelisted keywords
const highlightBest = function(){

    let allDescrs = document.querySelectorAll('.info-card-description, .info-card-title');

    allDescrs.forEach(function(item){

        let text = item.textContent.toLowerCase();

        whilelistKeywords.forEach(function(word){
            if( text.includes(word.toLowerCase()) ){
                item.style.color = "#f00";
            }
        });

    });

};


// Highlights all jobs that don't have too many bids
const highlightFewBids = function(){

    let allBidCounters = document.querySelectorAll('.info-card-bids');

    allBidCounters.forEach(function(item){
        let textValue = item.textContent;
        let bidsNumber = extractNumFromString(textValue);

        if(bidsNumber <= bidsToHighlightLimit){
            item.style.color = "#F00";
            item.style.fontWeight = "bold";
        }
        
    });

};



// Hide jobs with too many bids
const hideCrowded = function(){

    let allBidCounters = document.querySelectorAll('.info-card-bids');

    allBidCounters.forEach(function(item){

        var mainParent = getClosestParent(item, '.search-result-item');

        let textValue = item.textContent;
        let bidsNumber = extractNumFromString(textValue);

        if(bidsNumber >= bidsToHideLimit){
            mainParent.style.display = "none";
        }
        
    });

};



// Adds event listener to pagination, so that the script is run every time I switch the page
const updateListener = function(){

    let pageButtons = document.querySelectorAll('[ng-click="selectPage(page.number)"]');
        
    pageButtons.forEach(function(btn){              
        btn.addEventListener('click', function(){

            // The function is run 2 seconds after the list of jobs is loaded
            setTimeout(function(){
                if(shouldHideSpamJobs){
                    hideAllSpam();
                }
                if(shouldHighlightFewBids){
                    highlightFewBids();
                }
                if(shouldHighlightBestJobs){
                    highlightBest();
                }
                if(shouldHideTooManyBids){
                    hideCrowded();
                }
                updateListener();
            }, 2000);

        });
    });

};


// Start the script when page loads
window.onload = function() {

    console.log('Extension is working');

    setTimeout(function(){
        if(shouldHideSpamJobs){
            hideAllSpam();
        }
        if(shouldHighlightFewBids){
            highlightFewBids();
        }
        if(shouldHighlightBestJobs){
            highlightBest();
        }
        if(shouldHideTooManyBids){
            hideCrowded();
        }
        updateListener();
    }, 2000);

}
