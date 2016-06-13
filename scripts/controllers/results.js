'use strict';

/**
 * @ngdoc function
 * @name ipswichJaffaResultsManagementApp.controller:Result2Ctrl
 * @description
 * # Result2Ctrl
 * Controller of the ipswichJaffaResultsManagementApp
 */
angular.module('ipswichJaffaResultsManagementApp')
.controller('ResultCtrl', ['$scope', '$filter', '$uibModal', '$log', 'dataFactory', 'utilityFactory', 'results', 'runners', 'events', function ($scope, $filter, $uibModal, $log, dataFactory, utilityFactory, results, runners, events) {
		
			$scope.currentPage = 1;
			$scope.pageSize = 10;
			$scope.collapseAddResultsForm = true;
			$scope.collapseSearchResultsForm = true;
			$scope.eventId = 0;
			$scope.race = {};			
			$scope.runners = runners.data;
			$scope.currentRunners = $filter('filter')($scope.runners, {
							isCurrentMember : '1'
						}, true);
			$scope.results = results.data;
			$scope.events = events.data;
			$scope.newResult = {};
			$scope.races = {};
			$scope.findResultsPromise;

			$scope.searchResults = function () {	
				$scope.loading = true;
				var fromDate = utilityFactory.formatDate($scope.search.fromDate);			
				var toDate = utilityFactory.formatDate($scope.search.toDate);			
				$scope.findResultsPromise = dataFactory.getResults($scope.search.eventId, fromDate, toDate, $scope.search.numberOfResults)
				.then(
					function (data) {
					$scope.results = data.data;								
				},
					function (reason) {					
					alert('Failed: ' + reason);
				});
			};

			$scope.showDate = function (date) {
				var parts = date.split('-');
				return new Date(parts[0], parts[1] - 1, parts[2]).toDateString();
			};
			
			$scope.eventChanged = function () {
				updateRaceList();				
			};		
			
			var updateRaceList = function () {
				if (typeof $scope.eventId === "undefined" ||
					$scope.eventId < 1)
					return;
				
				dataFactory.getRaces($scope.eventId)
				.then(
					function (data) {
					$scope.races = data.data;					
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};
			
			$scope.updateTableRaceList = function (eventId) {
				if (typeof eventId === "undefined" ||
					eventId < 1)
					return;
				
				dataFactory.getRaces(eventId)
				.then(
					function (data) {
					$scope.tableRaces = data.data;					
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.showRunner = function (result) {
				if (result.runnerId && $scope.runners.length) {
					var selected = $filter('filter')($scope.runners, {
							id : result.runnerId
						}, true);
					return selected.length ? selected[0].name : 'Not set';
				} else {
					return result.runnerName || 'Not set';
				}
			};

			$scope.showGrandPrixStatus = function (grandPrix) {
				var selected = $filter('filter')($scope.grandPrixStatuses, {
						value : grandPrix
					});
				return (grandPrix && selected.length) ? selected[0].text : 'Not set';
			};

			$scope.showEvent = function (result) {
				if (result.eventId && $scope.events.length) {
					var selected = $filter('filter')($scope.events, {
							id : result.eventId
						}, true);
					return selected.length ? selected[0].name : 'Not set';
				} else {
					return result.eventName || 'Not set';
				}
			};
			
			$scope.showRace = function (result) {
				if (result.raceId && $scope.tableRaces.length) {
					var selected = $filter('filter')($scope.tableRaces, {
							id : result.raceId
						}, true);
					return selected.length ? selected[0].date + (selected[0].description != "" ? ' ' + selected[0].description : '') : 'Not Set';
				} else {
					if (result.raceDescription === "") {
						return result.date;
					} else {
						return result.date + ' ' + result.raceDescription;
					}
				}
			};
			
			$scope.saveResult = function () {
				var result = {};
				result.eventId = $scope.eventId;
				result.raceId = $scope.race.id;
				
				result.position = $scope.newResult.position;
				result.info = $scope.newResult.info;
				result.runnerId = $scope.newResult.runner.id;
				result.time = $scope.newResult.time;
				result.date = $scope.race.date;
				result.courseId = $scope.race.courseId;
				result.isGrandPrixResult = $scope.race.isGrandPrixRace;
				result.team = $scope.newResult.team;				
				
				if (typeof result.courseId === "undefined")
					result.courseId = 0;
				if (typeof result.isGrandPrixResult === "undefined")
					result.isGrandPrixResult = 0;
				if (typeof result.time !== "undefined" && result.time.length == 5)
					result.time = "00:" + result.time;
					
				// Clear form
				clearNewResultsForm();
				
				dataFactory.saveResult(result)
				.then(
					function (data) {
					// Update table
					addResult(data.data);
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};
		
			$scope.removeResult = function (result) {
				dataFactory.deleteResult(result.id)
				.then(
					function (data) {
					var index = $scope.results.indexOf(result);
					if (index >= 0)
						$scope.results.splice(index, 1);
					else
						alert('Failed cannot find item in list');
				},
					function (reason) {
					alert('Failed: ' + reason);
				});

				return true;
			};				
			
			var addResult = function (result) {
				var inserted = {
					id : result.id,
					eventId : result.eventId,
					runnerId : result.runnerId,
					position : result.position,
					courseId : result.courseId,
					time : result.time,
					info : result.info,
					date : result.date,
					isGrandPrixResult : result.isGrandPrixResult,
					team: result.team
				};
				$scope.results.unshift(inserted);							
			};
			
			var clearNewResultsForm = function() {
				$scope.newResult = {};
				$scope.newResult.eventId = $scope.eventId;
				$scope.newResult.raceId = $scope.race.id;
				$scope.newResult.courseId = $scope.race.courseId;
				$scope.newResult.date = $scope.race.date;
				$scope.newResult.isGrandPrixResult = $scope.race.isGrandPrixRace;;
			};

			$scope.updateResult = function (field, value, resultId) {
				dataFactory.updateResult(resultId, field, value)
				.then(
					function (data) {
					return true;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};			
		}
	]);
