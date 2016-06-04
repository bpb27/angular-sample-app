angular.module('myApp').factory('DataService', ['$firebaseArray', function ($firebaseArray) {
	return {
		songs: $firebaseArray(new Firebase("https://thejams.firebaseio.com/musics"))
	};
}]);