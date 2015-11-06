'use strict';

/**
 * @ngdoc function
 * @name ipswichJaffaResultsManagementApp.controller:BodyController
 * @description
 * # BodyController
 * Controller of the ipswichJaffaResultsManagementApp
 */
angular.module('ipswichJaffaResultsManagementApp')
  .controller('BodyController', function ($scope, $rootScope) {	  
	$scope.name =  '';	  
	if ($rootScope.globals && $rootScope.globals.currentUser) {
		$scope.name =  $rootScope.globals.currentUser.name;
	}
	
  });
