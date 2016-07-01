"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".
"""

import django
from django.test import TestCase

# TODO: Configure your database in settings.py and sync before running tests.

class ITunesTest(TestCase):
    """Tests for the itunes API."""

    if django.VERSION[:2] >= (1, 7):
        # Django 1.7 requires an explicit setup() when running tests in PTVS
        @classmethod
        def setUpClass(cls):
            super(ITunesTest, cls).setUpClass()
            django.setup()

    #def test_home(self):
    #    """Tests the home page."""
    #    response = self.client.get('/')
    #    self.assertContains(response, 'Home Page1', 1, 200)