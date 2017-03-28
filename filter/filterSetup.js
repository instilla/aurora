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


window.onload = setTimeout(gatherMemberLabels,3000);

window.onload = setTimeout(popupSetup, 5000);

window.onload = setTimeout(gatherMemberLabels,10000);


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

	// create CSS and position it:

	var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('style');
    link.innerText = 
    	".card-label.mod-card-front {width:auto; height:8pt; line-height:8pt; padding:2px; text-shadow:none;font-size:8pt;}"
    ;
    head.appendChild(link);

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
	option = document.createElement("OPTION");
	option.value= "none";
	option.innerText="None";
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
	avatarDiv.className = "avatar-div";
	let string = "";
	for (let img of avatarArray) {
		string += img;
	}
	avatarDiv.innerHTML = string;

	for (let avatarImg of avatarDiv.childNodes) {
		avatarImg.style.marginRight = "3px";
		avatarImg.style.borderBottom = "2px solid #0067a3";
		avatarImg.style.opacity = "0.2";
		string = avatarImg.title;
		string = string.split("(");
		string = string[1].replace(")","");
		string = "@" + string;
		avatarImg.id = string;
		avatarImg.className = "aurora-avatar";

		// creating new popover
	}
	avatarDiv.style.display = "inline-block";
	avatarDiv.style.marginLeft ="160px";


	filterDiv.appendChild(avatarDiv);

	//create overing;

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
	return memberArray;


}

// function to stock and create the object for every Member/Labels !!! run it after the upload

function gatherMemberLabels() {
	let membersLabel = [];
	let avatarNodes = document.querySelectorAll("img.aurora-avatar");
	let cardImg;
	let label;
	let array = [];
	let iii=0;

	for (let img of avatarNodes) {
		array=[];
		membersLabel.push({title:"",labels:[]});
		membersLabel[iii].title = img.title;
		cardImgs = document.querySelectorAll("div.list-card-details img[title='" + img.title +"']");

		for (let cardImg of cardImgs) {

			label = cardImg.parentElement.parentElement.parentElement.querySelector("span.card-label");
			if (label !== null) {
				array.push(label.title);
			}

		}
		membersLabel[iii].labels = [ ... new Set (array)];
		iii++;
	}
	// console.log(membersLabel);
	chrome.storage.local.set({'membersLabel' : membersLabel});
}

//function to create popup based on stock 


function createPopupLabel(membersLabel){
	let avatarNodes = document.querySelectorAll("img.aurora-avatar");
	let divPopOver;
	let leftSpace = 165;
	let liLabel;
	let spanHead;
	
	

	for (avatar of avatarNodes) {
		
		// console.log(avatar.title);
		
		for (object of membersLabel) {
			// console.log(object);
			if (avatar.title == object.title) {
			divPopOver = document.createElement("DIV");
			divPopOver.className = "pop-over pop-over-list";
			spanHead = document.createElement("DIV");
			spanHead.className = ".pop-over-header-title";
			spanHead.innerText = avatar.title.split("(")[0];
			spanHead.style.fontWeight = "450";
			spanHead.style.borderBottom = "2px solid #f2f2f2";
			spanHead.style.textAlign = "center";
			spanHead.width = "100%";
			divPopOver.appendChild(spanHead);
				for (label of object.labels) {
					liLabel = document.createElement("LI");
					liLabel.innerText = label;
					divPopOver.appendChild(liLabel);
					// console.log(avatar.title);
				}
			divPopOver.id = object.title.split("(")[1].replace(")","");
			divPopOver.style.position = "absolute";
			divPopOver.style.top = "77px";
			divPopOver.style.left = leftSpace + "px";
			divPopOver.style.width = "150px";
			divPopOver.style.padding = "3px";
			document.body.appendChild(divPopOver);
			leftSpace +=33;
			divPopOver.style.display = "none";

			}

		}
	}
	// console.log("ok1");

}






//function to stock-create repeat for the first 10 seconds every 1 seconds.


function popupSetup() {
	chrome.storage.local.get("membersLabel", function(data) {
		// console.log(data.membersLabel);
		createPopupLabel(data.membersLabel);
		console.log("Aurora is on");
		
	})
}

