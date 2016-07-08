describe('data service', function () {

	var DataService;
	var FirebaseArray;

	beforeEach(module('myApp'));
	
	beforeEach(module(function ($provide) {
  		$provide.value('$firebaseArray', function () {});
	}));

	beforeEach(inject(function (_DataService_) {
		DataService = _DataService_;
		DataService.songs = new createFirebaseArray(dbSongs);
		DataService.comments = new createFirebaseArray(dbComments);
		DataService.tags = new createFirebaseArray(dbTags);
	}));

	
	describe('get returns a database', function () {

		it('should return a database', function (done) {

			DataService.get('songs').then(function (results) {
				expect(results.length).toEqual(dbSongs.length);
				done();
			});

		});

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
				expect(result).toEqual(dbSongs[0]);
				done();
			});
		
		});

		it('should return the first record on multiple match', function (done) {
			
			DataService.getOne('songs', 'genre', 'rock').then(function (result) {
				expect(result).toEqual(dbSongs[0]);
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
				expect(result).toEqual([dbSongs[0]]);
				done();
			});
		
		});

		it('should return an array with multiple records on multiple match', function (done) {
			
			DataService.getMany('songs', 'genre', 'rock').then(function (result) {
				expect(result).toEqual([dbSongs[0], dbSongs[1]]);
				done();
			});
		
		});	
	
	});

	describe('getChildRefs gets the full records of child refs', function () {		

		it('should return an empty array if no child refs', function (done) {
			
			DataService.getOne('songs', 'id', '1').then(function (song) {
				var comments = DataService.getChildRefs('comments', song);
				expect(comments).toEqual([]);
				done();
			});
		
		});

		it('should return an array of records if has child refs', function (done) {
			
			DataService.getOne('songs', 'id', '3').then(function (song) {
				var comments = DataService.getChildRefs('comments', song);
				var expectedComments = [dbComments[0], dbComments[1], dbComments[2]];
				expect(comments).toEqual(expectedComments);
				done();
			});
		
		});
	
	});

	
	var dbSongs = [
		{
			$id: '1',
			artist: 'Titus Andronicus', 
			genre: 'rock', 
			tags: {
				'1': true
			}
		}, 
		
		{
			$id: '2',
		 	artist: 'Cloud Nothings', 
		 	genre: 'rock', 
		 	tags: {
				'1': true
			}
		}, 

		{
			$id: '3',
		 	artist: 'Diarrhea Planet', 
		 	genre: 'punk', 
		 	comments: {
				'1': true,
				'2': true,
				'3': true
			}
		},
		
		{
			$id: '4',
		 	badData: 'Missing Stuff'
	 	}

	];

	var dbComments = [
		{$id: '1', comment: 'Great'}, 
		{$id: '2', comment: 'Bad'}, 
		{$id: '3', comment: 'A real treat'},
		{$id: '4', comment: 'Blasphemous'}
	];

	var dbTags = [
		{$id: '1', text: 'rock out'},
		{$id: '2', text: 'lame jams'}
	];

});