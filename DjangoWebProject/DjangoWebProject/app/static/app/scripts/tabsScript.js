function openTab(evt, tabId) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabId).style.display = "block";
    evt.currentTarget.className += " active";

    var prepFunc = tabPrepare[tabId];
    if (prepFunc)
        prepFunc();
}

function keyDown(eve) {
    if (eve.key == "Enter")
        addArtist();
}

function prepareAddArtistTab() {
    $('#artistTxt')[0].value = '';
    $('#addArtistResult')[0].innerText = '';
};

function prepareBrowseArtistsTab(){
    getArtists();
};

tabPrepare = {
    addArtistTab: prepareAddArtistTab,
    browseArtistsTab: prepareBrowseArtistsTab
}
