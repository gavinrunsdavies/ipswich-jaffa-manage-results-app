'use strict';

/**
 * @ngdoc function
 * @name ipswichJaffaResultsManagementApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ipswichJaffaResultsManagementApp
 */
angular.module('ipswichJaffaResultsManagementApp')
  .controller('MainCtrl', function ($scope, $rootScope) {
		$scope.name =  $rootScope.globals.currentUser.name
  });
