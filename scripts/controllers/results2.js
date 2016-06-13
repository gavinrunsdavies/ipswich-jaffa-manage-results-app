'use strict';

/**
 * @ngdoc function
 * @name ipswichJaffaResultsManagementApp.controller:Result2Ctrl
 * @description
 * # Result2Ctrl
 * Controller of the ipswichJaffaResultsManagementApp
 */
angular.module('ipswichJaffaResultsManagementApp')
.controller('Result2Ctrl', ['$scope', '$filter', '$uibModal', '$log', 'dataFactory', 'utilityFactory', 'results', 'runners', 'events', 'distances', 'coursetypes', 'countries', function ($scope, $filter, $uibModal, $log, dataFactory, utilityFactory, results, runners, events, distances, coursetypes, countries) {
		
			$scope.currentPage = 1;
			$scope.pageSize = 10;
			$scope.collapseAddResultsForm = true;
			$scope.collapseSearchResultsForm = true;
			$scope.isNewRace = false;
			$scope.eventId = 0;
			$scope.race = {};
			
			$scope.distances = distances.data;
			$scope.courseTypes = coursetypes.data;
			
			$scope.runners = runners.data;
			$scope.currentRunners = $filter('filter')($scope.runners, {
							isCurrentMember : '1'
						}, true);
			$scope.results = results.data;
			$scope.events = events.data;
			$scope.countries = countries.data;
			$scope.newResult = {};
			$scope.newRace = {};
			$scope.courses = {};
			$scope.races = {};
			$scope.findResultsPromise;

			$scope.grandPrixStatuses = [{
					value : 0,
					text : 'No'
				}, {
					value : 1,
					text : 'Yes'
				}
			];

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
				clearNewRaceForm();
				updateCourseList();
				updateRaceList();		
				$scope.isNewRace = false;				
			};
			
			var updateCourseList = function () {
				if (typeof $scope.eventId === "undefined" ||
					$scope.eventId < 1)
					return;
				
				dataFactory.getCourses($scope.eventId)
				.then(
					function (data) {
					$scope.courses = data.data;					
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
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
			
			$scope.saveRace = function () {
				var race = {};				
				race.eventId = $scope.eventId;
				race.date = utilityFactory.formatDate($scope.newRace.date);
				race.courseId = $scope.newRace.courseId;
				race.venue = $scope.newRace.venue;
				race.description = $scope.newRace.description;
				race.conditions = $scope.newRace.conditions;
				race.distanceId = $scope.newRace.distanceId;
				race.courseTypeId = $scope.newRace.courseTypeId;
				race.county = $scope.newRace.county;
				race.countryCode = $scope.newRace.countryCode;
				race.area = $scope.newRace.area;				
				race.isGrandPrixRace = $scope.newRace.isGrandPrixRace;
				
				if (typeof race.courseId === "undefined")
					race.courseId = 0;
				if (typeof race.isGrandPrixRace === "undefined")
					race.isGrandPrixRace = 0;				
				
				dataFactory.saveRace(race)
				.then(
					function (data) {					
					$scope.race = data.data;
					$scope.newResult.raceId = data.data.id;
					$scope.newResult.eventId = data.data.eventId;
					$scope.newResult.date = data.data.date;
					$scope.newResult.isGrandPrixResult = data.data.isGrandPrixRace;
					$scope.isNewRace = false;
					$scope.races.unshift(data.data);	
				},
					function (reason) {
					alert('Failed to save race: ' + reason);
				});
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
				result.courseId = $scope.race.isGrandPrixRace;
				result.isGrandPrixResult = $scope.race.isGrandPrixRace;
				result.team = $scope.newResult.team;				
				
				if (typeof result.courseId === "undefined")
					result.courseId = 0;
				if (typeof result.isGrandPrixResult === "undefined")
					result.isGrandPrixResult = 0;
				
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
				var date = $scope.newResult.date;
				var courseId = $scope.newResult.courseId;
				var isGrandPrixResult = $scope.newResult.isGrandPrixResult;
				$scope.newResult = {};
				$scope.newResult.eventId = $scope.eventId;
				$scope.newResult.raceId = $scope.raceId;
				$scope.newResult.courseId = courseId;
				$scope.newResult.date = date;
				$scope.newResult.isGrandPrixResult = isGrandPrixResult;
			};
			
			var clearNewRaceForm = function() {				
				$scope.newRace = {};
			};
			
			// Delete and reinsert
			$scope.updateResultDate = function (date, result) {
				$scope.removeResult(result);
				
				var updatedResult = {};
				updatedResult.position = result.position;
				updatedResult.info = result.info;
				updatedResult.team = result.team;
				updatedResult.runnerId = result.runnerId;
				updatedResult.eventId = result.eventId;
				updatedResult.time = result.time;
				updatedResult.date = date;
				updatedResult.courseId = result.courseId;				
				updatedResult.isGrandPrixResult = result.isGrandPrixResult;				
				
				dataFactory.saveResult(updatedResult)
				.then(
					function (data) {
					// Update table
					addResult(data.data);
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.updateResultPosition = function (position, resultId) {
				dataFactory.updateResult(resultId, 'position', position)
				.then(
					function (data) {
					return true;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};
			
			$scope.updateResultTeamNumber = function (team, resultId) {
				dataFactory.updateResult(resultId, 'scoring_team', team)
				.then(
					function (data) {
					return true;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.updateResultTime = function (time, resultId) {
				dataFactory.updateResult(resultId, 'result', time)
				.then(
					function (data) {
					return true;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.updateResultGrandPrixStatus = function (status, resultId) {
				dataFactory.updateResult(resultId, 'grandprix', status)
				.then(
					function (data) {
					return true;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.updateResultInfo = function (info, resultId) {
				dataFactory.updateResult(resultId, 'info', info)
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
