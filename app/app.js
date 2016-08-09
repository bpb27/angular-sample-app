// Any dependencies should also be added to karma.conf.js

angular.module('myApp', ['firebase', 'ngRoute', 'ngLess'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html'
            })
            .when('/music', {
                templateUrl: 'partials/music.html'
            })
            .when('/music/new', {
                templateUrl: 'partials/song-new.html'
            })
            .when('/music/:id', {
                templateUrl: 'partials/song.html'
            })
            .when('/music/:id/edit', {
                templateUrl: 'partials/song-edit.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
