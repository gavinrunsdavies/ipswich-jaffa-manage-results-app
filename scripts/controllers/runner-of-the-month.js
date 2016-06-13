'use strict';

/**
 * @ngdoc function
 * @name ipswichJaffaResultsManagementApp.controller:RunnerOfTheMonthCtrl
 * @description
 * # EventsCtrl
 * Controller of the ipswichJaffaResultsManagementApp
 */
angular.module('ipswichJaffaResultsManagementApp')
.controller('RunnerOfTheMonthCtrl', ['$scope', '$filter', 'dataFactory', 'runners', function ($scope, $log, dataFactory, runners) {

			$scope.members = runners.data;
			$scope.months = [{
					id : 0,
					text : 'January'
				}, {
					id : 1,
					text : 'February'
				}, {
					id : 2,
					text : 'March'
				}, {
					id : 3,
					text : 'April'
				}, {
					id : 4,
					text : 'May'
				}, {
					id : 5,
					text : 'June'
				}, {
					id : 6,
					text : 'July'
				}, {
					id : 7,
					text : 'August'
				}, {
					id : 8,
					text : 'September'
				}, {
					id : 9,
					text : 'October'
				}, {
					id : 10,
					text : 'November'
				}, {
					id : 11,
					text : 'December'
				}
			];
			$scope.month = new Date().getMonth();
			var currentYear = new Date().getFullYear();
			$scope.years = [];
			for (var i = 0; i <= 20; i++) {
				$scope.years.push(currentYear - i);
			}
			$scope.year = currentYear;

			$scope.submit = function () {
				var result = {
					year : $scope.year,
					month : $scope.month,
					men : $scope.adultMale,
					women : $scope.adultFemale,
					junior : $scope.junior
				};

				dataFactory.saveRunnerOfTheMonth(result)
				.then(
					function (data) {
					$scope.year = 0;
					$scope.month = 0;
					$scope.adultMale = 0;
					$scope.adultFemale = 0;
					$scope.junior = 0;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});

				return true;
			};
		}
	]);
