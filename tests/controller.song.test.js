describe('song controller', function () {

	var DataService;
	var scope;
	var routeParams;
	var controller;

	beforeEach(module('myApp'));

	beforeEach(function () {
  		DataService = new MockDataService({songs: songs});
	});

	beforeEach(inject(function ($controller) {
	  	scope = {};
	  	routeParams = {id: 1};
	  	controller = $controller('SongController', { 
	  		$scope: scope, 
	  		$routeParams: routeParams, 
	  		DataService: DataService 
	  	});
	}));

	
	describe('on init', function () {
		
		it('should find song based on routeParams id', function (done) {
			
			setTimeout(function () {
				expect(scope.song.id).toEqual(1);
				done();
			}, 200);
		
		});	
	
	});

	
	var songs = [
		{id: 0, artist: 'Titus Andronicus', genre: 'rock'}, 
		{id: 1, artist: 'Cloud Nothings', genre: 'rock'}, 
		{id: 2, differentProperty: 'differentValue'}
	];

});