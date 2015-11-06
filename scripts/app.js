'use strict';

/**
 * @ngdoc overview
 * @name ipswichJaffaResultsManagementApp
 * @description
 * # ipswichJaffaResultsManagementApp
 *
 * Main module of the application.
 */

// declare modules
angular.module('Authentication', []);
angular.module('Results', []);

var myApp = angular
	.module('ipswichJaffaResultsManagementApp', [
			'Authentication',
			'Results',
			'angularUtils.directives.dirPagination',
			'xeditable',
			'ngAnimate',
			'ngCookies',
			'ngResource',
			'ngRoute',
			'ui.bootstrap',
			'cgBusy'
		])
	.config(function ($routeProvider) {
		$routeProvider
		.when('/login', {
			controller : 'LoginController',
			templateUrl : 'views/login.html'			
		})
		.when('/', {
			templateUrl : 'views/main.html',
			controller : 'MainCtrl'
		})
		.when('/events', {
			templateUrl : 'views/events.html',
			controller : 'EventCtrl',
			resolve : {
				events : ['dataFactory', function (dataFactory) {
						return dataFactory.getEvents();
					}
				],
				distances : ['dataFactory', function (dataFactory) {
						return dataFactory.getDistances();
					}
				],
				coursetypes : ['dataFactory', function (dataFactory) {
						return dataFactory.getCourseTypes();
					}
				]
			}
		})
		.when('/results', {
			templateUrl : 'views/results.html',
			controller : 'ResultCtrl',
			resolve : {
				results : ['dataFactory', function (dataFactory) {
						return dataFactory.getResults();
					}
				],
				events : ['dataFactory', function (dataFactory) {
						return dataFactory.getEvents();
					}
				],
				runners : ['dataFactory', function (dataFactory) {
						return dataFactory.getRunners();
					}
				]
			}
		})
		.when('/runners', {
			templateUrl : 'views/runners.html',
			controller : 'RunnerCtrl',
			resolve : {
				runners : ['dataFactory', function (dataFactory) {
						return dataFactory.getRunners();
					}
				],
				genders : ['dataFactory', function (dataFactory) {
						return dataFactory.getGenders();
					}
				]
			}
		})
		.when('/rotm', {
			templateUrl : 'views/runner-of-the-month.html',
			controller : 'RunnerOfTheMonthCtrl',
			resolve : {
				runners : ['dataFactory', function (dataFactory) {
						return dataFactory.getRunners();
					}
				]
			}
		})
		.otherwise({
			redirectTo : '/login'
		});
	});

myApp.run(function (editableOptions) {
	editableOptions.theme = 'bs3';
});

myApp.run(['$rootScope', '$location', '$cookieStore', '$http',
		function ($rootScope, $location, $cookieStore, $http) {
			// keep user logged in after page refresh
			$rootScope.globals = $cookieStore.get('globals') || {};
			if ($rootScope.globals.currentUser) {
				$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
			}

			$rootScope.$on('$locationChangeStart', function (event, next, current) {
				// redirect to login page if not logged in
				if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
					$location.path('/login');
					//$rootScope.hideMenu = true;
				}
			});
		}
	]);	

myApp.run(['$rootScope',function($rootScope){

    $rootScope.stateIsLoading = false;
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.stateIsLoading = true;
    });
	
    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.stateIsLoading = false;
    });
	
    $rootScope.$on('$routeChangeError', function() {
        //catch error
    });

}]);

myApp.controller('ModalDeleteInstanceCtrl', function ($scope, $modalInstance) {

	$scope.delete  = function () {
		$modalInstance.close(true);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});
//http://codetunnel.io/how-to-do-loading-spinners-the-angular-way/
//http://stackoverflow.com/questions/11541695/redirecting-to-a-certain-route-based-on-condition
//http://jasonwatmore.com/post/2014/05/26/AngularJS-Basic-HTTP-Authentication-Example.aspx
//http://jasonwatmore.com/post/2015/03/10/AngularJS-User-Registration-and-Login-Example.aspx
//https://github.com/colthreepv/angular-login-example