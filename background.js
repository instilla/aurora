// background.js

// if not authenticaded -> open tabs

if (!localStorage.getItem('trello_token')) {
    chrome.tabs.create({url: chrome.extension.getURL('setting/index.html')});
}



// listener 

chrome.runtime.onMessage.addListener(function(request,sender, sendResponse) {

	// chrome.pageAction.show(sender.tab.id);

     // Now we have a token saved locally, as fetched from the settings page after authorization.
    if (request.command == 'saveToken') {
        localStorage.setItem('trello_token', request.token);
        sendResponse();
        return true;
    }

    // on activation retrieve list of labels

    if (request.command == 'giveMeLabels'){
    	trelloInit();
    	Trello.get('/boards/'+trelloBoard+'/labels', 
    		function(data){
    			sendResponse({answer: data});
    		},function(){
    			sendResponse({answer: "Trello get error"});
    		});
    	return true;
    }
});


// trello functions
function trelloInit() {
    Trello.setKey(APP_KEY);
    Trello.setToken(localStorage.getItem('trello_token'));
}


// Trello.get('/boards/TrCSPljX/labels', console.log("success"), console.log("error"))


// chrome.storage.local.get('memberAvatars', function(data){console.log(data)});