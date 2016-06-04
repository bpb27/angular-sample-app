var app = angular.module('myApp', ['firebase']);

app.factory('DataService', ['$firebaseArray', function ($firebaseArray) {
	return {
		music: $firebaseArray(new Firebase("https://thejams.firebaseio.com/musics")),
		comments: $firebaseArray(new Firebase("https://thejams.firebaseio.com/comments")),
		tags: $firebaseArray(new Firebase("https://thejams.firebaseio.com/tags")),
		users: $firebaseArray(new Firebase("https://thejams.firebaseio.com/users"))
	};
}]);

// app.controller('MusicController', ['$scope', 'DataService', function ($scope, DataService) {

// 	DataService.music.$loaded(function(music){ 
//     	$scope.songs = music;
//     });

//     DataService.comments.$loaded(function(comments){ 
//     	$scope.comments = comments;
//     });

//     DataService.tags.$loaded(function(tags){ 
//     	$scope.tags = tags;
//     });

// 	$scope.query = '';

// 	$scope.getSongCount = function () {
// 		return $scope.songs.length;
// 	}
	
// }]);

app.controller('MusicController', ['$scope', function ($scope) {

	$scope.query = '';

	$scope.getSongCount = function () {
		return $scope.songs.length;
	}
	
}]);