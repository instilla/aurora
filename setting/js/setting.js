function init() {
    // console.log("ciao");
    // Check if page load is a redirect back from the auth procedure


    if (HashSearch.keyExists('token')) {
        Trello.authorize(
            {
                name: "Aurora Extension",
                expiration: "never",
                interactive: false,
                scope: {read: true, write: false},
                success: function () {
                    chrome.runtime.sendMessage({
                            command: 'saveToken',
                            token: localStorage.getItem('trello_token')
                        }, function(response) { 
                                chrome.tabs.getCurrent(function (tab) {
                                chrome.tabs.remove(tab.id)
                            }
                        );
                    });
                },
                error: function () {
                    alert("Failed to authorize with Trello.")
                }
            }
        );
    }
    // Message and button containers
    var lout = document.querySelector("#aurora_loggedout");
    var lin = document.querySelector("#aurora_loggedin");

    // Log in button
    document.querySelector("#aurora_login").onclick = function () {
        Trello.setKey(APP_KEY);
        Trello.authorize(
            {
                name: "Aurora Extension",
                type: "redirect",
                expiration: "never",
                interactive: true,
                scope: {read: true, write: false},
                success: function () {
                    // Can't do nothing, we've left the page
                },
                error: function () {
                    alert("Failed to authorize with Trello.")
                }
            });
        
    };

    // Log out button
    document.querySelector("#aurora_logout").onclick = function () {
        Trello.deauthorize();
        location.reload();
        
    };

    if (!localStorage.trello_token) {
        lout.style.display = 'block';
        lin.style.display = 'none';
    } else {
        lout.style.display = 'none';
        lin.style.display = 'block';
    }
}
document.onload = init();