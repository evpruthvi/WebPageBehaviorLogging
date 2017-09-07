console.log("Content Script running!");

var upVoteElements = document.getElementsByClassName("vote-up-off");
var downVoteElements = document.getElementsByClassName("vote-down-off");
var submitButton = document.getElementById('submit-button');
var starElements = document.getElementsByClassName('star-off');
var edit = document.getElementsByClassName('suggest-edit-post');
var commentElements = document.getElementsByClassName('js-add-link comments-link disabled-link');
var relatedQuestionsElements = document.getElementsByClassName('related js-gps-related-questions');
var share = document.getElementsByClassName('short-link');
var postTags = document.getElementsByClassName('post-tag');
var askQuestion = document.getElementsByClassName('aside-cta');

var URL = document.URL;
var additionalInfo = URL.split("/questions/");
if(additionalInfo.length > 1){
	additionalInfo = additionalInfo[1];			
}
else{
	additionalInfo = "";	
}

	
function scrollInterval(waitTime) {
  var curTime = Date.now();
  return function() {
    if (Date.now() >= curTime + waitTime) {
		curTime = Date.now();
		console.log("Scrolled!");
		chrome.runtime.sendMessage({action:"scrolled",addition_info:additionalInfo});
    }
  }
}

window.addEventListener('scroll', scrollInterval(1000));


for(var i=0;i < askQuestion.length;i++){
    askQuestion[i].addEventListener("click", function(){
		console.log("AskQuestionClicked!");
		chrome.runtime.sendMessage({action:"askQuestionClicked",addition_info:additionalInfo});		
		}, false);
}

for(var i=0;i < postTags.length;i++){
    postTags[i].addEventListener("click", function(){
		console.log("PostTagClicked!");
		chrome.runtime.sendMessage({action:"postTagClicked",addition_info:additionalInfo});		
		}, false);
}

for(var i=0;i < edit.length;i++){
    edit[i].addEventListener("click", function(){
		console.log("Edited!");
		chrome.runtime.sendMessage({action:"edited",addition_info:additionalInfo});		
		}, false);
}

if(submitButton != null){
	submitButton.addEventListener("click", function(){
			console.log("Submitted!");
			chrome.runtime.sendMessage({action:"submitted",addition_info:additionalInfo});	
	}, false);
}

for(var i=0;i < share.length;i++){
    share[i].addEventListener("click", function(){
		console.log("Shared!");
		chrome.runtime.sendMessage({action:"shared",addition_info:additionalInfo});	
		}, false);
}

for(var i=0;i < commentElements.length;i++){
    commentElements[i].addEventListener("click", function(){
		console.log("Commented!");
		chrome.runtime.sendMessage({action:"commented",addition_info:additionalInfo});		
		}, false);
}

for(var i=0;i < starElements.length;i++){
    starElements[i].addEventListener("click", function(){
		console.log("Starred!");
		chrome.runtime.sendMessage({action:"starred",addition_info:additionalInfo});

		}, false);
}

for(var i=0;i < upVoteElements.length;i++){
    upVoteElements[i].addEventListener("click", function(){
		console.log("Upvoted!");
		chrome.runtime.sendMessage({action:"upVoted",addition_info:additionalInfo});	
		}, false);
}

for(var i=0;i < relatedQuestionsElements.length;i++){
    relatedQuestionsElements[i].addEventListener("click", function(){
		console.log("RelatedQuestionsClicked!");
		chrome.runtime.sendMessage({action:"realtedQuestionsClicked",addition_info:additionalInfo});	
		}, false);
}

for(var i=0;i<downVoteElements.length;i++){
     downVoteElements[i].addEventListener("click", function(){		
		console.log("Downvoated!");
		chrome.runtime.sendMessage({action:"downVoted",addition_info:additionalInfo});	
		}, false);  
}