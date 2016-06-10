describe('data service', function () {

	var DataService;
	var firebaseGlobal;

	beforeEach(function(){
		firebaseGlobal = window.Firebase;
		window.Firebase = function () {};
	});

	beforeEach(module('myApp'));
	
	beforeEach(module(function ($provide) {
  		$provide.value('$firebaseArray', mockFirebaseArrayService);
	}));

	beforeEach(inject(function (_DataService_) {
		DataService = _DataService_;
	}));

	afterEach(function(){
		window.Firebase = firebaseGlobal;
	});

	describe('getOne searches for a single record', function () {
		
		it('should return undefined if no match', function (done) {
			
			DataService.getOne('songs', 'artist', 'Fake Artist').then(function (result) {
				expect(result).toEqual(undefined);
				done();
			});
		
		});

		it('should return a single record on single match', function (done) {
			
			DataService.getOne('songs', 'artist', 'Titus Andronicus').then(function (result) {
				expect(result).toEqual(stubbedDatabase[0]);
				done();
			});
		
		});

		it('should return the first record on multiple match', function (done) {
			
			DataService.getOne('songs', 'genre', 'rock').then(function (result) {
				expect(result).toEqual(stubbedDatabase[0]);
				done();
			});
		
		});

		it('should use the $getRecord method if searching by id', function (done) {
			
			DataService.getOne('songs', 'id', 2).then(function (result) {
				expect(result).toEqual(stubbedDatabase[2]);
				done();
			});
		
		});
	
	});

	describe('getMany searches for multiple records', function () {
		
		
		it('should return an empty array if no match', function (done) {
			
			DataService.getMany('songs', 'arist', 'Fake Artist').then(function (result) {
				expect(result).toEqual([]);
				done();
			});
		
		});

		it('should return an array with a single record on single match', function (done) {
			
			DataService.getMany('songs', 'artist', 'Titus Andronicus').then(function (result) {
				expect(result).toEqual([stubbedDatabase[0]]);
				done();
			});
		
		});

		it('should return an array with multiple records on multiple match', function (done) {
			
			DataService.getMany('songs', 'genre', 'rock').then(function (result) {
				expect(result).toEqual(stubbedDatabase.splice(0,2));
				done();
			});
		
		});	
	
	});

	var stubbedDatabase = [
		{id: 0, artist: 'Titus Andronicus', genre: 'rock'}, 
		{id: 1, artist: 'Cloud Nothings', genre: 'rock'}, 
		{id: 2, differentProperty: 'differentValue'}
	];
	
	// $firebaseArray method
	stubbedDatabase.$getRecord = function (id) {
		var match;
		for (var i = 0; i < this.length; i++) {
			if (this[i].id === id)
				match = this[i];
		}
		return match;
	}

	function mockFirebaseArrayService () {
		
		function Firebase () {}
		
		return {
			$loaded: function (callback) {
				return new Promise(function (resolve, reject) {
					resolve(callback(stubbedDatabase));
				})
			}
		}
	}

});