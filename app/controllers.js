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
	['$scope', 'DataService', function ($scope, DataService) {

	DataService.songs.$loaded(function (songs) { 
		$scope.songs = songs;
	});

	$scope.query = '';

	$scope.getSongCount = function () {
		return $scope.songs.length;
	}
	
}]);

app.controller('SongController', 
	['$scope', 'DataService', '$routeParams', function ($scope, DataService, $routeParams) {

	DataService.getOne('songs', 'id', $routeParams.id).then(function (song) {
		$scope.song = song;
	});

}]);




