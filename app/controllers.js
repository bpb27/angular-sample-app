angular.module('myApp').controller('MusicController', ['$scope', 'DataService', function ($scope, DataService) {

	DataService.songs.$loaded(function(songs){ 
		$scope.songs = songs;
	});

	$scope.query = '';

	$scope.getSongCount = function () {
		return $scope.songs.length;
	}
	
}]);