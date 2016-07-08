describe('auth service', function () {

	var AuthService;
	var DataService;

	beforeEach(module('myApp'));
	
	beforeEach(module(function ($provide) {
  		DataService = new MockDataService({users: [existingUser]});
  		
  		$provide.value('DataService', DataService);
  		$provide.value('$firebaseAuth', MockFirebaseAuth);
  		$provide.value('$rootScope', MockRootScope);
	}));

	beforeEach(inject(function (_AuthService_) {
		AuthService = _AuthService_;
	}));

	
	describe('On init', function () {
		
		it('should call $getAuth and add the $onAuth listener', function () {

			expect(AuthService.auth.$getAuth).toHaveBeenCalled();
			expect(AuthService.auth.$onAuth).toHaveBeenCalled();
		
		});
	
	});

	describe('On createUser', function () {

		it('Should create and broadcast new user', function (done) {
			
			AuthService.createUser(newUserGoogleData);

			setTimeout(function () {
				expect(AuthService.user.gId).toEqual(newUser.gId);
				expect(AuthService.user.displayName).toEqual(newUser.displayName);
				expect(AuthService.user.image).toEqual(newUser.image);
				expect(AuthService.user.sourceDefault).toBeDefined();
				expect(AuthService.user.lastVisit).toBeDefined();
				expect(MockRootScope.$broadcast).toHaveBeenCalledWith('user:updated', AuthService.user);
				done();
			}, 200);

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

	describe('On auth change listener called with google data', function () {
		
		it('should set user, broadcast change on login, and update lastVisit', function (done) {

			AuthService.onAuthChange({google: existingUserGoogleData});
			
			setTimeout(function () {
	        	
	        	expect(AuthService.user).toEqual(existingUser);
	        	expect(MockRootScope.$broadcast).toHaveBeenCalledWith('user:updated', existingUser);
	        	expect(DataService.users.$save).toHaveBeenCalled();
	        	
	        	done();
	      
	      }, 200);
		
		});

		it('should set user to null and broadcast change on logout', function () {
			
			AuthService.onAuthChange();
			expect(AuthService.user).toEqual(null);
			expect(MockRootScope.$broadcast).toHaveBeenCalledWith('user:updated', null);
		
		});

		it('should handle login followed by logout', function (done) {
			
			AuthService.onAuthChange({google: existingUserGoogleData});

			setTimeout(function () {
	        	
	        	expect(AuthService.user).toEqual(existingUser);
	        	expect(MockRootScope.$broadcast).toHaveBeenCalledWith('user:updated', existingUser);
	        	expect(DataService.users.$save).toHaveBeenCalled();

	        	AuthService.onAuthChange();
				expect(AuthService.user).toEqual(null);
				expect(MockRootScope.$broadcast).toHaveBeenCalledWith('user:updated', null);
	        	
	        	done();
	      
	      }, 200);

		});

		it('should create new user if no user with matching google id is found', function (done) {

			AuthService.createUser = jasmine.createSpy('createUser');			
			AuthService.onAuthChange({google: {id: 5}});
			
			setTimeout(function () {
				expect(AuthService.createUser).toHaveBeenCalled();
				done();
			}, 200);

		});
	
	});

	
	var existingUser = {
		id: 1,
		gId: 123,
		displayName: 'Gary Nutmeats', 
		image: 'www.google.com/gn',
		sourceDefault: 'Spotify',
		lastVisit: '1/1/1999'
	};

	var existingUserGoogleData = {
		id: 123,
		displayName: 'Gary Nutmeats', 
		image: 'www.google.com/gn'
	};

	var newUser = {
		id: 2,
		gId: 456,
		displayName: 'Bobby Grapefruits', 
		image: 'www.google.com/bg',
		sourceDefault: 'Spotify',
		lastVisit: '1/1/1999'
	};

	var newUserGoogleData = {
		id: 456,
		displayName: 'Bobby Grapefruits', 
		profileImageURL: 'www.google.com/bg'
	};

});