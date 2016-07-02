function addArtist() {
    $('#addArtistResult')[0].innerText = '';
    var artistName = $('#artistTxt')[0].value;
    var requestUrl = '/artists/addArtist';
    $.ajax({
        type: "POST",
        url: requestUrl,
        dataType: "json",
        async: true,
        data: {
            csrfmiddlewaretoken: csrftoken,
            artist: artistName,
        },
        success: function (json) {
            $('#addArtistResult')[0].innerText = json.result;
        },
        error: function (a, b, c) {
            console.log(b + ', ' + c);
        }
    });
};

NumOfArtists = 0;
NumOfAlbums = 0;

function getArtists() {
    var requestUrl = '/artists/getArtists';
    $.ajax({
        type: "GET",
        url: requestUrl,
        dataType: "json",
        async: true,
        data: {
            csrfmiddlewaretoken: csrftoken,
            retrieved: NumOfArtists,
        },
        success: function (json) {
            NumOfArtists += json.numOfArtists;
            alert(json.artists);
        },
        error: function (a, b, c) {
            console.log(b + ', ' + c);
        }
    });
};

function getAlbums() {
    var requestUrl = '/artists/getArtists';
    $.ajax({
        type: "GET",
        url: requestUrl,
        dataType: "json",
        async: true,
        data: {
            csrfmiddlewaretoken: csrftoken,
            retrieved: NumOfArtists,
        },
        success: function (json) {
            NumOfArtists += json.numOfArtists;
            alert(json.artists);
        },
        error: function (a, b, c) {
            console.log(b + ', ' + c);
        }
    });
};