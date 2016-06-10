var app = angular.module('myApp');

app.service('AuthService', ['$firebaseAuth', 'DataService', '$rootScope', function ($firebaseAuth, DataService, $rootScope) {

 	this.auth = $firebaseAuth(new Firebase('https://thejams.firebaseio.com'));
	this.auth.$getAuth();
 	
 	this.user = null;
 	
 	this.login = function () {
 		this.auth.$authWithOAuthPopup('google');
 	}

 	this.logout = function () {
 		this.auth.$unauth();
 	}

 	this.onAuthChange = function (authData) {
		
		var self = this;

		if (authData) {
			DataService.getOne('users', 'gId', authData['google']['id']).then(function (user) {
				if (user) {
					self.user = user;
					$rootScope.$broadcast('user:updated', user);
				}
				else {
					//create user
				}
			});
		}
		else {
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

		getOne: function (db, key, value) {
			return get(this[db], key, value).then(function (results) {
				return results[0];
			});
		},
		
		getMany: function (db, key, value) {
			return get(this[db], key, value).then(function (results) {
				return results;
			});
		}
	
	};

	function get (db, key, value) {
		return db.$loaded(function (data) {
			
			if (!data || !data.length) 
				return [];
			
			if (key === 'id')
				return [data.$getRecord(value)];
			
			return data.filter(function (item) {
				if (item && item[key] && item[key] === value) return true;
			});
		
		});
	}

}]);