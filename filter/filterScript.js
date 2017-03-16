//filterScript is divided in three parts: setup/change-URL logic, listeners logic - and mask logic

let selectFilter = document.querySelector("#aurora-filter");
let memberAvatars = document.querySelectorAll("img.aurora-avatar")
setTimeout(putOnMask(),3000);
// refresh-Logic



function hrefHandler(){
    this.oldHref = window.location.href;
    this.Check;

    var that = this;
    var detect = function(){
        if(that.oldHref!=window.location.href){
            putOnMask();
            that.oldHref = window.location.href;
        }
    };
    this.Check = setInterval(function(){ detect() }, 100);
}

let hrefDetection = new hrefHandler();


//listener logic

// select

document.onload = selectFilter.addEventListener('change',(event)=>{
	let search = "";
	let array = [];
	let string = "";

	filterParameters = getParameterByName("filter");

	// check for member filters

	if (filterParameters !== null) {
		array = filterParameters.split(",");

		for (iii in array) {
			if (array[iii].indexOf("label:") == -1) {
				search = search + "," +  array[iii];
			}

		}
	}

	string = event.target.value.indexOf(" ") !== -1 ? event.target.value.replace(" ", "%20") : event.target.value;

	window.location.search = "?filter=label:" + string + search;


});

// mask logic

function putOnMask(){

	

	let filterParameters = getParameterByName("filter");

	if(filterParameters !== null) {
		if (filterParameters.indexOf("label") !== -1) {
			let string = filterParameters.indexOf(",") !== -1 ? filterParameters.split(",")[0] : filterParameters;
			selectFilter.value = string.replace("label:","");
		}
	}

	if (selectFilter.value !== "All projects") {
		for (let img of memberAvatars) {
			img.style.opacity = "0.4";
		}
		cardsSpan = document.querySelectorAll("div.list-card-details span[title='" + selectFilter.value + "']");
		// console.log(cardsSpan[0].parentElement.parentElement);
		cardsMember = [];
		for (let span of cardsSpan) {
			cardsMember.push(span.parentElement.parentElement.querySelector("img.member-avatar").title);
		}
		cardsMember = [... new Set(cardsMember)]
		
		for (img of memberAvatars) {
			for (let string of cardsMember) {
				if (string == img.title) {
					img.style.opacity = "1";
				}
			}
		}
 
	} else {
		for (let img of memberAvatars) {
			img.style.opacity = "1";
		}
	}




}


//function from: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
