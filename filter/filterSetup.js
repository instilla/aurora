// content.js to setup filterUI and inject the filtering logic into html.



// retrieve list data from backgrounbd and update DOM

chrome.runtime.sendMessage( 
	{command:'giveMeLabels'},
	function(response) {
		
		// setup memberAvatars
		let avatarArray = [];
	
		chrome.storage.local.get('memberAvatars', function(data){
			if (Object.keys(data)==0) {
				avatarArray = extractMembers();
			} else {
				avatarArray = data.memberAvatars
			};

			createFilterUI(response,avatarArray);
			injectJS("/filter/filterScript.js");
		});
	}
);

// listen to update from popup
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {

		if (request.command == "updateAvatar"){
			let random = extractMembers();
			window.location.href = window.location.href;
		}
 });

function createFilterUI(labelList,avatarArray){

	// console.log(avatarArray);

	//create and position the div

	let parentDiv = document.querySelector("#surface");
	let filterDiv = document.createElement("DIV");
	let contentDiv = document.querySelector("#content");
	filterDiv.id = "header";
	filterDiv.className = "board-header-btn-name board-header-btn";
	parentDiv.insertBefore(filterDiv,contentDiv);
	


	//create select 

	let selectUI = document.createElement("SELECT");
	selectUI.id = "aurora-filter";
	let option;
	option = document.createElement("OPTION");
	option.value= "All projects";
	option.innerText="All projects";
	selectUI.appendChild(option);
	for (iii in labelList.answer) {

		if (labelList.answer[iii].name!="") {
			option = document.createElement("OPTION");
			option.value=labelList.answer[iii].name;
			option.innerText=labelList.answer[iii].name;
			selectUI.appendChild(option);
			
		}
	}
	let styleDiv = document.createElement("DIV");
	styleDiv.style.display = "inline-block";
	styleDiv.style.position = "absolute";
	styleDiv.style.width = "150px";

	filterDiv.appendChild(styleDiv);

	selectUI.style.width = "150px";
	styleDiv.appendChild(selectUI);

	//create the avatar

	let avatarDiv = document.createElement("DIV");
	let string = "";
	for (let img of avatarArray) {
		string += img;
	}
	avatarDiv.innerHTML = string;

	for (let avatarImg of avatarDiv.childNodes) {
		avatarImg.style.marginRight = "3px";
		avatarImg.style.borderBottom = "2px solid #0067a3";
		avatarImg.style.opacity = "0.2";
		// avatarImg.style.borderBottom = "2px solid #0067a3"
		string = avatarImg.title;
		string = string.split("(");
		string = string[1].replace(")","");
		string = "@" + string;
		avatarImg.id = string;
		avatarImg.className = "aurora-avatar"
	}
	avatarDiv.style.display = "inline-block";
	avatarDiv.style.marginLeft ="160px";


	filterDiv.appendChild(avatarDiv);

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



function extractMembers(){

	let nodeList;
	let memberArray = [];
	
	document.querySelector("a.js-show-sidebar").click();
	nodeList = document.querySelectorAll("img.member-avatar");
	for ( let node of nodeList) memberArray.push(node.outerHTML);
	memberArray = [... new Set(memberArray)];
	chrome.storage.local.set({'memberAvatars' : memberArray});
	// chrome.runtime.sendMessage(
	// 	{
	// 		command : "saveMembers", 
	// 		array : memberArray
	// 	}, function () {
	// 		//update members
	// 	}
	// );
	return memberArray;


}


console.log("Aurora is On");