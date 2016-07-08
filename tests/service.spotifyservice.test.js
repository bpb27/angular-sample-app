describe('spotify service', function () {

	var SpotifyService;
	var $httpBackend;

	beforeEach(module('myApp'));

	beforeEach(inject(function (_SpotifyService_, _$httpBackend_) {
		SpotifyService = _SpotifyService_;
		$httpBackend = _$httpBackend_;
		
		$httpBackend
			.when('GET', 'https://api.spotify.com/v1/tracks/' + trackId)
         .respond(stubSpotifyTrack);
      
      $httpBackend
			.when('GET', 'https://api.spotify.com/v1/albums/' + albumId)
         .respond(stubSpotifyAlbum);
	}));
	
	afterEach(function() {
     	$httpBackend.verifyNoOutstandingExpectation();
     	$httpBackend.verifyNoOutstandingRequest();
   });
	
	describe('parse for spotify song id', function () {

		it('returns an empty string if no id is found', function () {

			expect(SpotifyService.pullUri()).toEqual('');
			expect(SpotifyService.pullUri('')).toEqual('');
			expect(SpotifyService.pullUri('no_id_here')).toEqual('');

		});

		it('correctly parses URIs, links, embed code', function () {
			
			expect(SpotifyService.pullUri(song.uri)).toEqual(trackId);
			expect(SpotifyService.pullUri(song.link)).toEqual(trackId);
			expect(SpotifyService.pullUri(song.embed)).toEqual(trackId);

		});

	});

	describe('hitting spotify api', function () {

		it('returns the proper track data', function () {

			$httpBackend.expectGET('https://api.spotify.com/v1/tracks/' + trackId);
			
			SpotifyService.getTrack(trackId).then(function(result){
				expect(model).toEqual(result);
			});

			$httpBackend.flush();

		});

		it('returns the proper album data', function () {

			$httpBackend.expectGET('https://api.spotify.com/v1/albums/' + albumId);
			
			SpotifyService.getAlbum(albumId).then(function(result){
				expect(result.year).toEqual('2011-06-13');
			});

			$httpBackend.flush();

		});

	});

	describe('creating embeddable iframe', function () {

		it('properly forms track iframe', function () {
			
			var html = SpotifyService.getEmbedFrame('track', trackId);
			var expectation = '<iframe src="https://embed.spotify.com/?uri=spotify:track:' + trackId + '" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>';
			
			expect(html).toEqual(expectation);
		
		});

		it('properly forms album iframe', function () {
			
			var html = SpotifyService.getEmbedFrame('album', albumId);
			var expectation = '<iframe src="https://embed.spotify.com/?uri=spotify:album:' + albumId + '" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>';
			
			expect(html).toEqual(expectation);
		
		});

	});

	
	var trackId = '5avInxT0Dl9y93kBGMnWKX';
	
	var albumId = '3YUCk9Q1vjWsZsTur93sQP';
	
	var song = {
		uri: 'spotify:track:5avInxT0Dl9y93kBGMnWKX',
		link: 'https://open.spotify.com/track/5avInxT0Dl9y93kBGMnWKX',
		embed: '<iframe src="https://embed.spotify.com/?uri=spotify%3Atrack%5avInxT0Dl9y93kBGMnWKX" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>'
	};

	var model = {
		album: 'Go Tell Fire To The Mountain', 
		artist: 'WU LYF', 
		image: 'https://i.scdn.co/image/8678c7e585d0fcbaa2c6a968db599825da42331e', 
		title: 'We Bros',
		spotifyAlbum: 'spotify:album:3YUCk9Q1vjWsZsTur93sQP', 
		spotifyTrack: trackId
	};


});