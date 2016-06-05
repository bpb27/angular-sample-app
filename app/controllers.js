angular.module('myApp').controller("AuthController", ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {
	
 	$scope.authObj = $firebaseAuth(new Firebase("https://thejams.firebaseio.com"));
 	
 	$scope.user = $scope.authObj.$getAuth();
 	
 	$scope.authObj.$onAuth(function (authData) {
		if (authData)
			$scope.user = authData;
		else
			$scope.user = null;
	});

 	$scope.login = function () {
 		$scope.authObj.$authWithOAuthPopup("google").then(function (authData) {
			console.log("Logged in as:", authData.uid);
		}).catch(function(error) {
			console.error("Authentication failed:", error);
		});
 	}

 	$scope.logout = function () {
 		$scope.authObj.$unauth();
 	}

}]);

angular.module('myApp').controller('MusicController', ['$scope', 'DataService', function ($scope, DataService) {

	DataService.songs.$loaded(function(songs){ 
		$scope.songs = songs;
	});

	$scope.query = '';

	$scope.getSongCount = function () {
		return $scope.songs.length;
	}
	
}]);