//filterScript is divided in three parts: setup/change-URL logic, listeners logic - and mask logic

let selectFilter = document.querySelector("#aurora-filter");
let memberAvatars = document.querySelectorAll("img.aurora-avatar")

// refresh-Logic

putOnMask();

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

// avatar

for (let img of memberAvatars) {
	 img.addEventListener('click',(event) => {clickAvatar(event)});
}


function clickAvatar(event) {
	let string ="";
	let parameters = getParameterByName("filter");


		// with selected event
		if (parameters !== null) {
			if (parameters.indexOf(event.target.id) !== -1) {
				string = (parameters.split(",").length < 0) ? "" : window.location.search.replace(event.target.id,"");

			} else {
			string= window.location.search + "," + event.target.id;
			}
		} else {
			string= "?filter=" + event.target.id;
		}

	 window.location.href = window.location.href.split("?")[0] + string;
}



// mask logic

function putOnMask(){

	let filterParameters = getParameterByName("filter");

	if (filterParameters == null) {
		selectFilter.value = "All projects";
		for (let img of memberAvatars) {
			img.style.borderBottom = "2px solid #0067a3";
		}


	} else {

		if(filterParameters.indexOf("label") !== -1) {
			let string = filterParameters.indexOf(",") !== -1 ? filterParameters.split(",")[0] : filterParameters;
			selectFilter.value = string.replace("label:","");
		}

		if(filterParameters.indexOf("@") !== -1){
			for (let parameter of filterParameters.split(",")) {
				for (let img of memberAvatars) {
					if(img.id == parameter) {
						img.style.borderBottom = "4px solid orange";
					}
				}
			}
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
