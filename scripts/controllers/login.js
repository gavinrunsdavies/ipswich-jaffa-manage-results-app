'use strict';

angular.module('Authentication')

.controller('LoginController',
	['$scope', '$rootScope', '$location', 'AuthenticationService',
		function ($scope, $rootScope, $location, AuthenticationService) {

			// reset login status
			AuthenticationService.ClearCredentials();
			$scope.$parent.name = '';

			$scope.login = function () {
				$scope.dataLoading = true;
				AuthenticationService.Login($scope.username, $scope.password)
				.then(function (response) {
					AuthenticationService.SetCredentials($scope.username, $scope.password, response.data.data.display_name);
					$location.path('/');
					
					// Set name in Body Controller
					$scope.$parent.name = response.data.data.display_name;
				},
					function (reason) {
					$scope.error = reason.data[0].message;
					$scope.dataLoading = false;
				});
			};
		}
	]);
