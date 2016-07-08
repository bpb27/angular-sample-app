describe('music controller', function () {

	var DataService;
	var scope;
	var controller;

	beforeEach(module('myApp'));

	beforeEach(function () {
  		DataService = new MockDataService({songs: songs});
	});

	beforeEach(inject(function($controller){
	  	scope = { $apply: function () {} };
	  	controller = $controller('MusicController', { $scope: scope, DataService: DataService });
	}));

	describe('on init', function () {
		
		it('should get all songs', function (done) {
			
			setTimeout(function () {
				expect(scope.songs.length).toEqual(3);
				done();
			}, 200);
		
		});	
	
	});

	var songs = [
		{id: 0, artist: 'Titus Andronicus'}, 
		{id: 1, artist: 'Cloud Nothings'}, 
		{id: 2, badData: 'Missing Stuff'}
	];

});