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

	$scope.play = function (song) {
		$rootScope.$broadcast('music:play', song.spotifyLink);
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

}]);

app.controller('SongController', 
	['$scope', '$routeParams', 'DataService', function ($scope, $routeParams, DataService) {

	DataService.getOne('songs', 'id', $routeParams.id).then(function (song) {
		$scope.song = song;
	});

}]);




