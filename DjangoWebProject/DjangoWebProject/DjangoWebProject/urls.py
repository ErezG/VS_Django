"""
Definition of urls for DjangoWebProject.
"""

from django.conf.urls import include, url

urlpatterns = [
    url(r'^artists/', include('artistsApp.urls')),
    url(r'', include('app.urls')),
]