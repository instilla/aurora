
document.querySelector("button#settings").addEventListener('click', () => { 
	chrome.tabs.create({url: 'setting/index.html'})
});



// document.querySelector("button#update").addEventListner('click', () => {

	
// })