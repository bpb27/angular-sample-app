var app = angular.module('myApp');

app.controller('AuthController', ['$scope', 'AuthService', function ($scope, AuthService) {

    $scope.$on('user:updated', function (event, data) {
        $scope.user = data
    });

    $scope.login = function () {
        AuthService.login();
    }

    $scope.logout = function () {
        AuthService.logout();
    }

}]);

app.controller('MusicController', ['$scope', '$rootScope', 'DataService', function ($scope, $rootScope, DataService) {

    $scope.songs = [];
    $scope.query = '';
    $scope.selectedTag = null;

    DataService.get('songs').then(function (songs) {
        $scope.songs = songs;
        $scope.$apply();
    });

    $scope.getComments = function (song) {
        return DataService.getChildRefs('comments', song);
    }

    $scope.getTags = function (song) {
        return DataService.getChildRefs('tags', song);
    }

    $scope.selectTag = function (tag) {
        $scope.selectedTag = $scope.selectedTag === tag ? null : tag;
    }

    $scope.play = function (song) {
        $rootScope.$broadcast('music:play', song.spotifyLink);
    }

    $scope.playAll = function () {
        $rootScope.$broadcast('music:playAll', $scope.filteredSongs);
    }

}]);

app.controller('PlayerController', ['$scope', 'SpotifyService', function ($scope, SpotifyService) {

    $scope.close = function () {
        $scope.embed = '';
    }

    $scope.$on('music:play', function (event, data) {
        $scope.embed = SpotifyService.getEmbedFrame('track', data);
    });

    $scope.$on('music:playAll', function (event, data) {
        $scope.embed = SpotifyService.getEmbedFrame('trackset', data);
    });

}]);

app.controller('SongController', ['$scope', '$routeParams', 'DataService', 'SpotifyService', function ($scope, $routeParams, DataService, SpotifyService) {

    DataService.getOne('songs', 'id', $routeParams.id).then(function (song) {
        $scope.song = song;
        $scope.embed = song.albumLink ? SpotifyService.getEmbedFrame('album', song.albumLink, 300, 500) : '';
        console.log(song);
    });

    $scope.getComments = function (song) {
        return DataService.getChildRefs('comments', song);
    }

    $scope.getTags = function (song) {
        return DataService.getChildRefs('tags', song);
    }

}]);

app.controller('SongNewController', ['$scope', '$routeParams', 'DataService', 'SpotifyService', function ($scope, $routeParams, DataService, SpotifyService) {

    $scope.error = '';
    $scope.song = {};

    $scope.getSong = function (uri) {
        SpotifyService.getTrack(uri).then(function (track) {
            $scope.song = track;
            $scope.embed = SpotifyService.getEmbedFrame('track', track.spotifyTrack, 300);
        });
    }

    $scope.saveSong = function () {
        if (!$scope.review)
            return $scope.error = 'Dearest Señor, a review please.';
        console.log($scope.song, $scope.review);
    }

}]);
