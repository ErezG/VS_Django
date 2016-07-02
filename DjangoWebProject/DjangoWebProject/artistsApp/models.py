"""
Definition of models.
"""

from django.db import models
from datetime import date

# Create your models here.
class Artist(models.Model):
    artistId = models.IntegerField(primary_key = True)
    artistName = models.TextField()

    def serialize(self):
        return {
            'artistId': self.artistId,
            'artistName': self.artistName
        }

class Album(models.Model):
    collectionId = models.IntegerField(primary_key = True)
    collectionName = models.TextField()
    releaseDate = models.DateField(default=date.today)
    artworkUrl100 = models.TextField()
    artist = models.ForeignKey('Artist')

    def serialize(self):
        return {
            'collectionId': self.collectionId,
            'collectionName': self.collectionName,
            'releaseDate': self.releaseDate,
            'artworkUrl100': self.artworkUrl100
        }