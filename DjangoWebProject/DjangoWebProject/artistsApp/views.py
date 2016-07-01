"""
Definition of views.
"""

from django.http import HttpRequest, JsonResponse
from . import models
import httplib2
import urllib
import json

def addArtist(request):
    assert isinstance(request, HttpRequest)
    
    # call ITunes API
    artistName = str.casefold(request.POST.get("artist"))
    validResults = [];
    numOfAlbums = 0
    resultText = ''
    httpClient = httplib2.Http()
    url = 'https://itunes.apple.com/search?term={artistName}&country=US&media=music&entity=album&attribute=artistTerm&limit=200'.format(artistName = urllib.parse.quote_plus(artistName))
    resp, content = httpClient.request(url, method="GET")
    if resp.status >= 200 and resp.status < 300:
        iTunesData = json.loads(content.decode())
        if iTunesData["resultCount"] > 0:
            for result in iTunesData["results"]:
                if str.casefold(result["artistName"]) == artistName:
                    validResults.append(result)
            numOfAlbums = len(validResults)
            if numOfAlbums > 0:
                # save results to DB
                artist = models.Artist.objects.get_or_create(artistId = validResults[0]['artistId'], artistName = validResults[0]['artistName'])[0];
                for result in validResults:
                    models.Album.objects.get_or_create(collectionId = result['collectionId'],collectionName = result['collectionName'], artworkUrl100 = result['artworkUrl100'], artist = artist);
                resultText = "All albums added"

    if numOfAlbums == 0:
        resultText = "Artist not found"

    return JsonResponse({'result': resultText})