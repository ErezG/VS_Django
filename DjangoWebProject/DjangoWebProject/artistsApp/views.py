"""
Definition of views.
"""

from django.http import HttpRequest, JsonResponse
from dateutil import parser
from . import models
import httplib2
import urllib
import json

def addArtist(request):
    assert isinstance(request, HttpRequest)
    
    # call ITunes API
    artistName = str.casefold(request.POST.get("artist"));
    validResults = [];
    numOfAlbums = 0;
    resultText = '';
    httpClient = httplib2.Http();
    url = 'https://itunes.apple.com/search?term={artistName}&country=US&media=music&entity=album&attribute=artistTerm&limit=200'.format(artistName = urllib.parse.quote_plus(artistName));
    resp, content = httpClient.request(url, method="GET");
    if resp.status >= 200 and resp.status < 300:
        iTunesData = json.loads(content.decode());
        if iTunesData["resultCount"] > 0:
            for result in iTunesData["results"]:
                if str.casefold(result["artistName"]) == artistName:
                    validResults.append(result);
            numOfAlbums = len(validResults);
            if numOfAlbums > 0:
                # save results to DB
                artist = models.Artist.objects.get_or_create(artistId = validResults[0]['artistId'], artistName = validResults[0]['artistName'])[0];
                for result in validResults:
                    models.Album.objects.get_or_create(collectionId = result['collectionId'],
                                                       collectionName = result['collectionName'],
                                                       artworkUrl100 = result['artworkUrl100'],
                                                       releaseDate = parser.parse(result['releaseDate']).date(),
                                                       artist = artist);
                resultText = "All albums added";

    if numOfAlbums == 0:
        resultText = "Artist not found";

    return JsonResponse({'result': resultText});

def getArtists(request):
    assert isinstance(request, HttpRequest)
    
    skip =  int(request.GET.get('retrieved', 0));
    take = 20 if skip == 0 else 10;

    # load from DB, 50 first time, 25 after.
    artistsQuery = models.Artist.objects.order_by('artistName')[skip:skip+take];
    artists = serializeModels(artistsQuery);
    return JsonResponse({'numOfArtists': len(artists), 'artists': artists});

def getAlbums(request):
    assert isinstance(request, HttpRequest)
    
    skip =  int(request.GET.get("retrieved", 0));
    take = 20 if skip == 0 else 10;
    artistName = request.GET.get('artist');
    orderBy = request.GET.get('orderBy', 'collectionName');# collectionName / releaseDate

    # load from DB, 50 first time, 25 after, according to order by(name, date).
    artist = models.Artist.objects.get(artistName = artistName);
    albumsQuery = models.Album.objects.filter(artist = artist).order_by(orderBy)[skip:skip+take];
    albums = serializeModels(albumsQuery);
    return JsonResponse({'numOfAlbums': len(albums), 'albums': albums});

def serializeModels(itemsQuery):
    items = [];
    for item in itemsQuery:
        items.append(item.serialize());
    return items;