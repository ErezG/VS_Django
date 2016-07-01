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