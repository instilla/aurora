// content.js to setup filterUI and injext the filtering logic into html.

console.log("Aurora is On");

// retrieve list data from backgrounbd and update DOM

chrome.runtime.sendMessage( 
	{command:'giveMeLabels'},
	function(response) {
		createFilterUI(response);
		injectJS("/filter/filterScript.js");
	} 
);




function createFilterUI(labelList){

	//create and position the div

	let parentDiv = document.querySelector("#surface");
	let filterDiv = document.createElement("DIV");
	let contentDiv = document.querySelector("#content");
	filterDiv.id = "header";
	filterDiv.className = "board-header-btn-name board-header-btn";
	parentDiv.insertBefore(filterDiv,contentDiv);
	


	//create the select

	let selectUI = document.createElement("SELECT");
	selectUI.id = "aurora-filter";
	let option;
	option = document.createElement("OPTION");
	option.value= "tutti";
	option.innerText="tutti";
	selectUI.appendChild(option);
	for (iii in labelList.answer) {

		if (labelList.answer[iii].name!="") {
			option = document.createElement("OPTION");
			option.value=labelList.answer[iii].name;
			option.innerText=labelList.answer[iii].name;
			selectUI.appendChild(option);
			
		}
	}

	filterDiv.appendChild(selectUI);


}



function injectJS(path) {

	var scriptURL = chrome.extension.getURL(path);

	let script = document.createElement("SCRIPT");
	script.src = scriptURL;
	document.body.appendChild( script );

}


function injectCSS(path) {

	var scriptURL = chrome.extension.getURL(path);

	let stylesheet = document.createElement("LINK");
	stylesheet.src = scriptURL;
	stylesheet.rel = "stylesheet";
	document.head.appendChild( stylesheet );

}