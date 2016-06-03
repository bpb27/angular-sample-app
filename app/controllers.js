angular.module('myApp').controller('MusicController', function ($scope) {

	$scope.songs = [
		{title: 'Televators', artist: 'The Mars Volta'},
		{title: 'Reptilla', artist: 'The Strokes'},
	];

	$scope.getSongCount = function () {
		return $scope.songs.length;
	}
	
});