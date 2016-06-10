describe('auth service', function () {

	var AuthService;
	var firebaseGlobal;
	var user = {id: 1, user: 'Gary Nutmeats'};

	beforeEach(function(){
		firebaseGlobal = window.Firebase;
		window.Firebase = function () {};
	});

	beforeEach(module('myApp'));
	
	beforeEach(module(function ($provide) {
  		$provide.value('$firebaseAuth', mockFirebaseAuthService);
  		$provide.value('DataService', mockDataService);
  		$provide.value('$rootScope', mockRootscope);
	}));

	beforeEach(inject(function (_AuthService_) {
		AuthService = _AuthService_;
	}));

	afterEach(function(){
		window.Firebase = firebaseGlobal;
	});

	describe('On init', function () {
		
		it('should call $getAuth and add the $onAuth listener', function () {

			expect(AuthService.auth.$getAuth).toHaveBeenCalled();
			expect(AuthService.auth.$onAuth).toHaveBeenCalled();
		
		});
	
	});

	describe('On login and logout', function () {
		
		it('should call $authWithOAuthPopup on login', function () {

			AuthService.login();
			expect(AuthService.auth.$authWithOAuthPopup).toHaveBeenCalledWith('google');
		
		});

		it('should call $unauth on logout', function () {

			AuthService.logout();
			expect(AuthService.auth.$unauth).toHaveBeenCalled();
		
		});
	
	});

	describe('On auth change', function () {
		
		it('should set user and broadcast change on login', function (done) {

			AuthService.onAuthChange({google: {id: 1}});
			setTimeout(function() {
	        	
	        	expect(AuthService.user).toEqual(user);
	        	expect(mockRootscope.$broadcast).toHaveBeenCalledWith('user:updated', user);
	        	
	        	done();
	      
	      }, 200);
		
		});

		it('should set user to null and broadcast change on logout', function () {
			
			AuthService.onAuthChange();
			expect(AuthService.user).toEqual(null);
			expect(mockRootscope.$broadcast).toHaveBeenCalledWith('user:updated', null);
		
		});

		it('should handle login followed by logout', function () {
			
			AuthService.onAuthChange({google: {id: 1}});
			setTimeout(function() {
	        	
	        	expect(AuthService.user).toEqual(user);
	        	expect(mockRootscope.$broadcast).toHaveBeenCalledWith('user:updated', user);

	        	AuthService.onAuthChange();
				expect(AuthService.user).toEqual(null);
				expect(mockRootscope.$broadcast).toHaveBeenCalledWith('user:updated', null);
	        	
	        	done();
	      
	      }, 200);

		});
	
	});

	function mockFirebaseAuthService () {
		
		return {
			$getAuth: jasmine.createSpy('$getAuth'),
			$authWithOAuthPopup: jasmine.createSpy('$authWithOAuthPopup'),
			$unauth: jasmine.createSpy('$unauth'),
			$onAuth: jasmine.createSpy('$onAuth')
		}
	
	}

	var mockDataService = {
		getOne: function (db, key, value) {
			return new Promise(function (resolve, reject) {
				resolve(user);
			});
		}
	};

	var mockRootscope = {
		$broadcast: jasmine.createSpy('$broadcast')
	};

});