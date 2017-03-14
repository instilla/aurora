

let selectFilter = document.querySelector("#aurora-filter");

// select-filter initial value

	let filterParameters = getParameterByName("filter");

	if(filterParameters !== null && filterParameters.indexOf("label") !== -1) {
		let string = filterParameters.indexOf(",") !== -1 ? filterParameters.split(",")[0] : filterParameters;
		string = string.replace("label:","");
		selectFilter.value = string;

	}

//filter listner

document.onload = selectFilter.addEventListener('change',(event)=>{
	let search = "";
	let string = "";

	filterParameters = getParameterByName("filter");

	if (filterParameters !== null) {
		string = filterParameters.split(",");

		for (iii in string) {
			if (string[iii].indexOf("label:") == -1) {
				search = search + "," +  string[iii];
			}

		}
	}

	window.location.search = "?filter=label:" + event.target.value + search;


});

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

