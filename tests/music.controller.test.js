describe('music controller', function () {

	beforeEach(angular.mock.module('myApp'));

	var $controller;

	beforeEach(angular.mock.inject(function(_$controller_){
	  	$controller = _$controller_;
	  	console.log(_$controller_);
	}));

	describe('songs', function () {
		
		it('total should equal 2', function () {
			
			var $scope = {};
			var controller = $controller('MusicController', { $scope: $scope });

			expect($scope.getSongCount()).toEqual(0);
		
		});	
	});

	// var mockDataService = {
	// 	music: loaded,
	// 	comments: loaded,
	// 	tags: loaded,
	// 	users: loaded
	// };

	// var loaded = {
	// 	$loaded: function (callback) {
	// 		callback([]);
	// 	}
	// };

});