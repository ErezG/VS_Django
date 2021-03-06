﻿(function (app) {
    app.AppComponent =
        ng.core.Component({
            selector: 'my-app',

            template: `
                <ul class ="tab">
                    <li><a href="#" class ="tablinks"[class.active]="activeTab==='addArtistTab'" (click) ="onTabClick('addArtistTab')">Add artist</a></li>
                    <li><a href="#" class ="tablinks"[class.active]="activeTab==='browseArtistsTab'" (click)="onTabClick('browseArtistsTab')">Browse artists</a></li>
                </ul>

                <div id="addArtistTab" class ="tabcontent">
                    <h3>Add Artist</h3>
                    <input [(ngModel)]="addArtistText" placeholder="artist's name" (keydown) ="addArtistByKeyDown($event)"/>
                    <input type="button" value="add" (click)="addArtist()"/>
                    <br/>
                    <br/>
                    <img width="50" src="http://i.imgur.com/8YsAmq3.gif" *ngIf="loading"/>
                    <div>{{addArtistResult}}</div>
                </div>

                <div id="browseArtistsTab" class ="tabcontent">
                    <div>
                        <h3>Browse artists</h3>
                    </div>
                    <br>
                    <div id="artistsCollection">
                        <h4>order ablums by: </h4>
                        <select (change) ="onAlbumsOrderByChange($event.target.value)">
                            <option *ngFor="let option of albumsOrderByOptions">{{option}}</option>
                        </select>
                        <ul class ="itemsList">
                            <li *ngFor="let artist of artists" (click)="onArtistSelect(artist)" [class.selected]="artist===selectedArtist">
                                <span class ="badge">{{artist.artistName}}</span>
                            </li>
                        </ul>
                    </div>

                    <div id="albumsCollection" *ngIf="selectedArtist">
                        <h4>Search Album: </h4>
                        <input [(ngModel)]="albumSearchTerm" placeholder="album's name" (keydown) ="searchAlbumByKeyDown($event)"/>
                        <input type="button" value="search" (click) ="searchAlbum()"/>
                        <ul id="albumsList">
                        </ul>
                        <img width="100" src="http://i.imgur.com/8YsAmq3.gif" *ngIf="loading"/>
                    </div>
                </div>`,

            styles: [`
                    .selected {
                        background-color: #CFD8DC !important;
                        color: white;
                    }
                    .itemsList li {
                        cursor: pointer;
                        position: relative;
                        left: 0;
                        background-color: #EEE;
                        margin: .5em;
                        padding: .3em 0;
                        height: 1.6em;
                        border-radius: 4px;
                    }
                    .itemsList li.selected: hover {
                        background-color: #BBD8DC !important;
                        color: white;
                    }
                    .itemsList li: hover {
                        color: #607D8B;
                        background-color: #DDD;
                        left: .1em;
                    }
                    .itemsList .text {
                        position: relative;
                        top: -3px;
                    }
                    .itemsList .badge {
                        display: inline-block;
                        font-size: small;
                        color: white;
                        padding: 0.8em 0.7em 0 0.7em;
                        background-color: #607D8B;
                        line-height: 1em;
                        position: relative;
                        left: -1px;
                        top: -4px;
                        height: 1.8em;
                        margin-right: .8em;
                        border-radius: 4px 0 0 4px;
                    }
                `]
        })
        .Class({
            constructor: function () {
                var _this = this;

                var NumOfArtists = 0;
                var NumOfAlbums = 0;

                function emptyArtists() {
                    NumOfArtists = 0;
                    _this.artists = [];
                };

                function emptyAlbums() {
                    NumOfAlbums = 0;
                    _this.albums =[];
                    var albumsList = $('#albumsList')[0];
                    if (albumsList)
                        albumsList.innerHTML = '';
                };

                var artistsAPI = {

                    addArtist: function () {
                        _this.addArtistResult = '';
                        var requestUrl = '/artists/addArtist';
                        $.ajax({
                            type: "POST",
                            url: requestUrl,
                            dataType: "json",
                            async: true,
                            data: {
                                csrfmiddlewaretoken: csrftoken,
                                artist: _this.addArtistText,
                            },
                            success: function (json) {
                                _this.addArtistResult = json.result;
                            },
                            error: function (a, b, c) {
                                console.log(b + ', ' + c);
                            },
                            beforeSend: function (a, b) {
                                _this.loading = true;
                            },
                            complete: function (a, b) {
                                _this.loading = false;
                            }
                        });
                    },

                    getArtists: function () {
                        var requestUrl = '/artists/getArtists';
                        $.ajax({
                            type: "GET",
                            url: requestUrl,
                            dataType: "json",
                            async: true,
                            data: {
                                csrfmiddlewaretoken: csrftoken
                            },
                            success: function (json) {
                                NumOfArtists += json.numOfArtists;
                                _this.artists = _this.artists.concat(json.artists);
                            },
                            error: function (a, b, c) {
                                console.log(b + ', ' + c);
                            },
                            beforeSend: function (a, b) {
                                _this.loading = true;
                            },
                            complete: function (a, b) {
                                _this.loading = false;
                            }
                        });
                    },

                    getAlbums: function () {
                        var requestUrl = '/artists/getAlbums';
                        $.ajax({
                            type: "GET",
                            url: requestUrl,
                            dataType: "json",
                            async: true,
                            data: {
                                csrfmiddlewaretoken: csrftoken,
                                artist: _this.selectedArtist.artistName,
                                orderBy: _this.albumsOrderBy,
                                retrieved: NumOfAlbums,
                            },
                            success: function (json) {
                                NumOfAlbums += json.numOfAlbums;
                                var albumsList = $('#albumsList');
                                for (var index in json.albums) {
                                    let album = json.albums[index];
                                    albumsList.append('<span id="album_' + album.collectionId + '">' + album.collectionName + ':</span><br>released: ' + album.releaseDate + '<br><img src="' + album.artworkUrl100 + '" alt="' + album.collectionName + '"><br><br><br>')
                                }
                                _this.albums = _this.albums.concat(json.albums);
                            },
                            error: function (a, b, c) {
                                console.log(b + ', ' + c);
                            },
                            beforeSend: function (a, b) {
                                _this.loading = true;
                            },
                            complete: function (a, b) {
                                _this.loading = false;
                            }
                        });
                    }
                }

                this.addArtistText = '';
                this.addArtistResult = '';

                this.loading = false;
                this.artists = [];
                this.albums = [];
                this.activeTab = undefined;
                this.selectedArtist = undefined;
                this.addArtist = function () {
                    artistsAPI.addArtist();
                };
                this.addArtistByKeyDown = function (event) {
                    if (event.key == "Enter")
                        this.addArtist();
                };
                this.onArtistSelect = function (artist) {
                    emptyAlbums();
                    if (this.selectedArtist === artist) {
                        this.selectedArtist = undefined;
                    }
                    else {
                        this.selectedArtist = artist;
                        artistsAPI.getAlbums();
                    }
                };
                this.onTabClick = function (tabName) {
                    activeTab = tabName;
                    var prepFunc = this.tabPrepare[tabName];
                    if (prepFunc)
                        prepFunc();
                    openTab(tabName);
                };

                function prepareAddArtistTab() {
                    _this.addArtistText = '';
                    _this.addArtistResult = '';
                };
                function prepareBrowseArtistsTab() {
                    emptyArtists();
                    emptyAlbums();
                    artistsAPI.getArtists();
                };
                this.tabPrepare = {
                    addArtistTab: prepareAddArtistTab,
                    browseArtistsTab: prepareBrowseArtistsTab
                };

                this.albumsOrderByOptions = [
                    'collectionName',
                    'releaseDate'
                ];
                this.albumsOrderBy = this.albumsOrderByOptions[0];
                this.onAlbumsOrderByChange = function (newSelection) {
                    this.albumsOrderBy = newSelection;
                    emptyAlbums();
                    if (this.selectedArtist) {
                        artistsAPI.getAlbums();
                    }
                };

                this.albumSearchTerm = ''
                this.searchAlbum = function () {
                    var term = this.albumSearchTerm.toLowerCase();
                    for (var index in this.albums) {
                        var album = this.albums[index];
                        if (album.collectionName.toLowerCase().startsWith(term)) {
                            var targetOffset = $('#album_' + album.collectionId)[0].offsetTop;
                            window.scrollTo(0, targetOffset - 60);
                            break;
                        }
                    }
                    var a = 3;
                };
                this.searchAlbumByKeyDown = function (event) {
                    if (event.key == "Enter")
                        this.searchAlbum();
                };

                $(document).ready(function() {
	                var win = $(window);

	                // Each time the user scrolls
	                win.scroll(function() {
		                // End of the document reached?
		                if ($(document).height() - win.height() == win.scrollTop()) {
		                    artistsAPI.getAlbums();
		                }
	                });
                });
            }
        });
})(window.app || (window.app = {}));