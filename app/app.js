// Any dependencies should also be added to karma.conf.js

angular.module('myApp', ['firebase', 'ngRoute', 'ngLess'])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'partials/home.html'
			})
			.when('/music', {
				templateUrl: 'partials/music.html'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);