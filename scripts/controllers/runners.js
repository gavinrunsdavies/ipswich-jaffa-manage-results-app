'use strict';

/**
 * @ngdoc function
 * @name ipswichJaffaResultsManagementApp.controller:RunnerCtrl
 * @description
 * # RunnerCtrl
 * Controller of the ipswichJaffaResultsManagementApp
 */
angular.module('ipswichJaffaResultsManagementApp')
.controller('RunnerCtrl', ['$scope', '$filter', '$uibModal', '$log', 'dataFactory', 'utilityFactory', 'runners', 'genders', function ($scope, $filter, $uibModal, $log, dataFactory, utilityFactory, runners, genders) {

			$scope.currentPage = 1;
			$scope.pageSize = 10;
			$scope.runners = runners.data;
			$scope.genders = genders.data;
			$scope.newRunner = {};

			$scope.currentMemberStatuses = [{
					value : 0,
					text : 'No'
				}, {
					value : 1,
					text : 'Yes'
				}
			];

			$scope.openCalendar = function ($event) {
				$scope.calendarStatus.opened = true;
			};

			$scope.calendarStatus = {
				opened : false
			};

			$scope.showCurrentMemberStatus = function (currentMember) {
				var selected = $filter('filter')($scope.currentMemberStatuses, {
						value : currentMember
					});
				return (currentMember && selected.length) ? selected[0].text : 'Not set';
			};

			$scope.showDate = function (date) {
				var parts = date.split('-');
				return new Date(parts[0], parts[1] - 1, parts[2]).toDateString();
			};	

			$scope.saveRunner = function () {
				// Change date to PHP format
				var runner = $scope.newRunner;
				runner.dateOfBirth = utilityFactory.formatDate($scope.newRunner.dateOfBirth);

				var result = dataFactory.saveRunner(runner)
					.then(
						function (data) {
						// Update table and clear form.
						$scope.runners.unshift(data.data);
						$scope.newRunner = {};
					},
						function (reason) {
						alert('Failed: ' + reason.data[0].message);
					});
			};			

			$scope.removeRunner = function (runner) {
				//$scope.openDeleteConfirmationDialog(); TODO

				dataFactory.deleteRunner(runner.id)
				.then(
					function (data) {
					var index = $scope.runners.indexOf(runner);
					if (index >= 0)
						$scope.runners.splice(index, 1);
					else
						alert('Failed cannot find item in list');
				},
					function (reason) {
					alert('Failed: ' + reason.data[0].message);
				});

				return true;
			};
			
			$scope.updateMemberName = function (data, runnerId) {
				if (data.length < 2) {
					return "Invalid name; name must be at least 2 characters long.";
				}

				dataFactory.updateRunner(runnerId, 'name', data)
				.then(
					function (data) {
					return true;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};
			
			$scope.updateMemberStatus = function (data, runnerId) {

				dataFactory.updateRunner(runnerId, 'current_member', data)
				.then(
					function (data) {
					return true;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.openDeleteConfirmationDialog = function () {

				var modalInstance = $uibModal.open({
						animation : true,
						templateUrl : 'modalConfirmDelete.html',
						controller : 'ModalDeleteInstanceCtrl',
						size : 'sm'
					});

				// Only returned when true (e.g.  not cancelled)
				modalInstance.result.then(function (deleteAll) {
					$log.info('Modal dismissed at: ' + new Date() + ' deleteAll: ' + deleteAll);
				});
			};
		}
	]);
