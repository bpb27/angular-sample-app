window.Firebase = function () { };


function MockDataService (config) {
	
	Object.keys(config).forEach(function (key) {
		this[key] = createFirebaseArray(config[key]);
	}.bind(this));	

	this.get = function (db) {
		return new Promise(function (resolve, reject) {
			resolve(this[db]);
		}.bind(this));
	}

	this.getOne = function (db, key, value) {
		
		var result = this[db].filter(function(item){
			return item[key] === value;
		})[0];
		
		return new Promise(function (resolve, reject) {
			resolve(result);
		}.bind(this));
	
	}

}


function MockFirebaseArray (arr) {
	this.constructor = function () {
		return createFirebaseArray(arr);
	}
}


function createFirebaseArray (arr) {

	arr.$add = function (dataToAdd) {
		return new Promise(function (resolve, reject) {
			resolve(dataToAdd);
		});
	}

	arr.$loaded = function (callback) {
		var self = this;
		return new Promise(function (resolve, reject) {
			resolve(callback(self));
		});
	}

	arr.$getRecord = function (id) {
		var match;
		for (var i = 0; i < this.length; i++) {
			if (this[i].id === id || this[i].$id === id)
				match = this[i];
		}
		return match;
	}

	arr.$save = jasmine.createSpy('$save');

	return arr;

}


function MockFirebaseAuth () {
	
	return {
		$getAuth: jasmine.createSpy('$getAuth'),
		$authWithOAuthPopup: jasmine.createSpy('$authWithOAuthPopup'),
		$unauth: jasmine.createSpy('$unauth'),
		$onAuth: jasmine.createSpy('$onAuth')
	}

}


var MockRootScope = {
	$broadcast: jasmine.createSpy('$broadcast')
};