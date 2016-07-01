function addArtist(artistName) {
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
            alert(json.result);
        },
        error: function (a, b, c) {
            alert(b + ', ' + c);
        }
    });
};