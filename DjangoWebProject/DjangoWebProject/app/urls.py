"""
Definition of urls for DjangoWebProject.
"""

from django.conf.urls import patterns, url
from . import views

app_name = 'app'
urlpatterns = [
    url(r'^$', views.home, name='home')
]