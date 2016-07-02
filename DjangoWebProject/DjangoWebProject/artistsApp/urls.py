"""
Definition of urls for DjangoWebProject.
"""

from django.conf.urls import patterns, url
from . import views

app_name = 'artistsApp'
urlpatterns = [
    url(r'^addArtist$', views.addArtist, name='addArtist'),
    url(r'^getArtists$', views.getArtists, name='getArtists'),
    url(r'^getAlbums$', views.getAlbums, name='getAlbums'),
]