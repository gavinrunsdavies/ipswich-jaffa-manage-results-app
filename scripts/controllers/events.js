'use strict';

/**
 * @ngdoc function
 * @name ipswichJaffaResultsManagementApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the ipswichJaffaResultsManagementApp
 */
angular.module('ipswichJaffaResultsManagementApp')
.controller('EventCtrl', ['$scope', '$filter', '$uibModal', '$log', 'dataFactory', 'events', function ($scope, $filter, $uibModal, $log, dataFactory, events) {

			$scope.currentPage = 1;
			$scope.pageSize = 10;
			$scope.events = events.data;			
			$scope.newEvent = {};		

			$scope.updateEventName = function (data, eventId) {
				if (data.length < 3) {
					return "Invalid event name; name must be at least 2 characters long.";
				}

				dataFactory.updateEvent(eventId, 'name', data)
				.then(
					function (data) {
					return true;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.updateEventWebsite = function (data, eventId) {
				if (data.indexOf("http") != 0) {
					return "Invalid website URL; string must begin with http.";
				}

				dataFactory.updateEvent(eventId, 'website', data)
				.then(
					function (data) {
					return true;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.saveEvent = function () {
				var result = dataFactory.saveEvent($scope.newEvent)
					.then(
						function (data) {
						// Add count 0 and update table
						var event = data.data;
						angular.extend(event, {
							count : 0
						});
						$scope.events.unshift(event);
					},
						function (reason) {
						alert('Failed: ' + reason);
					});
			};
			
			$scope.removeEvent = function (event) {
				dataFactory.deleteEvent(event.id)
				.then(
					function (data) {
					var index = $scope.events.indexOf(event);
					if (index >= 0)
						$scope.events.splice(index, 1);
					else
						alert('Failed cannot find item in list');
				},
					function (reason) {
					alert('Failed: ' + reason);
				});

				return true;
			};
			
			$scope.mergeEvents = function () {
				var result = dataFactory.mergeEvents($scope.fromEvent.id, $scope.toEvent.id)
					.then(
						function (data) {
						var index = $scope.events.indexOf($scope.fromEvent);
						if (index >= 0)
							$scope.events.splice(index, 1);
						else
							alert('Failed cannot find item in list');
					},
						function (reason) {
						alert('Failed: ' + reason);
					});
			};
		}
	]);
