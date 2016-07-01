"""
Definition of models.
"""

from django.db import models
from datetime import date

# Create your models here.
class Artist(models.Model):
    artistId = models.IntegerField(primary_key = True)
    artistName = models.TextField()
    albums = []

class Album(models.Model):
    collectionId = models.IntegerField(primary_key = True)
    collectionName = models.TextField()
    releaseDate = models.DateField(default=date.today)
    artworkUrl100 = models.TextField()
    artist = models.ForeignKey('Artist')