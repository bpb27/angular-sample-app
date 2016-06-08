var app = angular.module('myApp');

app.controller("AuthController", 
	["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {
	
	 	$scope.auth = $firebaseAuth(new Firebase("https://thejams.firebaseio.com"));
	 	
	 	$scope.user = $scope.auth.$getAuth();

	 	$scope.auth.$onAuth(function (authData) {
			if (authData)
				$scope.user = authData;
			else
				$scope.user = null;
		});
	 	
	 	$scope.login = function () {
	 		$scope.auth.$authWithOAuthPopup("google").then(function (authData) {
				console.log("Logged in as:", authData.uid);
			}).catch(function(error) {
				console.error("Authentication failed:", error);
			});
	 	}

	 	$scope.logout = function () {
	 		$scope.auth.$unauth();
	 	}

}]);

app.controller('MusicController', 
	['$scope', 'DataService', function ($scope, DataService) {

		DataService.songs.$loaded(function(songs){ 
			$scope.songs = songs;
		});

		$scope.query = '';

		$scope.getSongCount = function () {
			return $scope.songs.length;
		}
	
}]);

app.controller('SongController', 
	['$scope', 'DataService', '$routeParams', function ($scope, DataService, $routeParams) {

		DataService.songs.$loaded(function(songs){ 
			$scope.song = songs.$getRecord($routeParams.id);
		});

}]);




