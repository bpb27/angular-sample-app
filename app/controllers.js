var app = angular.module('myApp');

app.controller('AuthController',
	['$scope', 'AuthService', function ($scope, AuthService) {

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

app.controller('MusicController',
	['$scope', '$rootScope', 'DataService', function ($scope, $rootScope, DataService) {

	$scope.songs = [];
	$scope.query = '';

	DataService.get('songs').then(function (songs) {
		$scope.songs = songs;
		$scope.$apply();
	});

	$scope.getTags = function (song) {
		return DataService.getChildRefs('tags', song);
	}

	$scope.getComments = function (song) {
		return DataService.getChildRefs('comments', song);
	}

	$scope.play = function (song) {
		$rootScope.$broadcast('music:play', song.spotifyLink);
	}

	$scope.playAll = function () {
		$rootScope.$broadcast('music:playAll', $scope.filteredSongs);
	}

}]);

app.controller('PlayerController',
	['$scope', 'SpotifyService', function ($scope, SpotifyService) {

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

app.controller('SongController',
	['$scope', '$routeParams', 'DataService', function ($scope, $routeParams, DataService) {

	DataService.getOne('songs', 'id', $routeParams.id).then(function (song) {
		$scope.song = song;
	});

}]);

app.controller('SongNewController',
	['$scope', '$routeParams', 'DataService', 'SpotifyService', function ($scope, $routeParams, DataService, SpotifyService) {

	$scope.error = '';
	$scope.review = '';
	$scope.song = {};

	$scope.getSong = function (uri) {
		SpotifyService.getTrack(uri).then(function(track){
			$scope.song = track;
			$scope.embed = SpotifyService.getEmbedFrame('track', track.spotifyTrack, 300);
		}, function () {
			$scope.error = "Apologies Señor, but that appears to be a bullshit spotify URI.";
		});
	}

	$scope.saveSong = function () {
		if (!$scope.review)
			return $scope.error = 'Dearest Señor, a review please.';
	}

}]);
