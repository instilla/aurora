
document.querySelector("button#settings").addEventListener('click', () => { 
	chrome.tabs.create({url: 'setting/index.html'})
});

document.querySelector("button#update").addEventListener('click', () => {

	chrome.tabs.query({url: trelloPage + "*"}, function(results) {
	     if (results.length == 0) {
	        chrome.tabs.create({url: trelloPage})
	     } else {
	     	chrome.tabs.sendMessage(results[0].id, {command:'updateAvatar'});
	     }
	});

});
