describe('music controller', function () {

	var scope, controller;

	beforeEach(module('myApp'));

	beforeEach(inject(function($controller){
	  	scope = {};
	  	controller = $controller('MusicController', { $scope: scope, DataService: mockDataService });
	}));

	describe('songs', function () {
		
		it('total should equal 0', function () {
			expect(scope.getSongCount()).toEqual(0);
		});	
	
	});

	var mockDataService = {
		songs: {
			$loaded: function (callback) {
				callback([]);
			}
		}
	};

});