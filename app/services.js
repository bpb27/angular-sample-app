var app = angular.module('myApp');

app.service('AuthService', ['$firebaseAuth', 'DataService', '$rootScope', function ($firebaseAuth, DataService, $rootScope) {

 	this.auth = $firebaseAuth(new Firebase('https://thejams.firebaseio.com'));
	this.auth.$getAuth();
 	this.user = null;
 	
 	this.createUser = function (data) {
 		var self = this;
 		
 		var newUser = {
			gId: data['id'],
			displayName: data['displayName'],
			image: data['profileImageURL'],
			sourceDefault: 'spotify',
			lastVisit: new Date().toUTCString()
		};
		
		DataService.users.$loaded(function (users) {
			users.$add(newUser).then(function(user){
				self.user = user;
				$rootScope.$broadcast('user:updated', user);
			});
		});
 	
 	}

 	this.login = function () {
 		this.auth.$authWithOAuthPopup('google');
 	}

 	this.logout = function () {
 		this.auth.$unauth();
 	}

 	this.onAuthChange = function (authData) {
		
		var self = this;
		
		if (authData)
			findUser(authData) 
		else 
			setUserToNull();

		
		function findUser (gId) {
			
			DataService.getOne('users', 'gId', authData.google.id).then(function (user) {
				
				if (!user) return self.createUser(authData);
					
				self.user = user;
				$rootScope.$broadcast('user:updated', user);

				user.lastVisit = new Date().toUTCString();
				DataService.get('users').then(function (users) {
					users.$save(user);
				});
			
			});
		}
		
		function setUserToNull () {
			self.user = null;
			$rootScope.$broadcast('user:updated', null);
		}
			
	}

 	this.auth.$onAuth(this.onAuthChange.bind(this));

}]);

app.factory('DataService', ['$firebaseArray', function ($firebaseArray) {
	
	return {
		
		songs: $firebaseArray(new Firebase("https://thejams.firebaseio.com/musics")),
		
		users: $firebaseArray(new Firebase("https://thejams.firebaseio.com/users")),
		
		tags: $firebaseArray(new Firebase("https://thejams.firebaseio.com/tags")),

		get: function (db) {
			return new Promise (function (resolve, reject) {
				this[db].$loaded(resolve);
			}.bind(this));
		},

		getOne: function (db, key, value) {
			return get(this[db], key, value).then(function (results) {
				return results[0];
			});
		},
		
		getMany: function (db, key, value) {
			return get(this[db], key, value).then(function (results) {
				return results;
			});
		},

		getChildRefs: function (db, record) {
			return Object.keys(record[db] || {}).map(function(id){
				return this[db].$getRecord(id);
			}.bind(this));
		}
	
	};

	function get (db, key, value) {
		return db.$loaded(function (data) {
			
			if (!data) return [];
			
			if (key === 'id')
				return [data.$getRecord(value)];
			
			return data.filter(function (item) {
				if (item && item[key] && item[key] === value) return true;
			});
		
		});
	}

}]);

app.factory('SpotifyService', ['$http', '$sce', function ($http, $sce) {
	
	return {
		
		apiAlbum: 'https://api.spotify.com/v1/albums/',
		
		apiTrack: 'https://api.spotify.com/v1/tracks/',

		getAlbum: function (uri) {
			return $http.get(this.apiAlbum + uri).then(function (album) {
				try {
					return {
						year: album.data.release_date
					};
				} catch (error) {
					return {};
				}
			});
		},

		getEmbedFrame: function (type, uri) {
			if (uri.indexOf(':') !== -1)
				uri = this.pullUri(uri);
			return $sce.trustAsHtml('<iframe src="https://embed.spotify.com/?uri=' + 'spotify:' + type + ':' + uri + '" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>');
		},
		
		getTrack: function (uri) {
			return $http.get(this.apiTrack + uri).then(function (song) {
				try {
					return {
						album: song.data.album.name,
						spotifyAlbum: song.data.album.uri,
						artist: song.data.artists[0].name,
						image: findImage(song.data.album.images).url,
						spotifyTrack: uri,
						title: song.data.name
					};
				} catch (error) {
					return {};
				}
			});
		},

		pullUri: function (str) {
			if (!str) return '';

			str = str.match(/\w+/g).filter(function (item) { 
				return item.length > 21;
			})[0] || '';

			return str.substring(0, 2) === '3A' ? str.substring(2) : str;
		}
	
	};

	function findImage (arr) {
		return arr.filter(function (item) {
			return item.height === 300;
		})[0] || arr[0];
	}

}]);

