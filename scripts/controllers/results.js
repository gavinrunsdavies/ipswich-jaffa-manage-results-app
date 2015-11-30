'use strict';

/**
 * @ngdoc function
 * @name ipswichJaffaResultsManagementApp.controller:ResultCtrl
 * @description
 * # ResultCtrl
 * Controller of the ipswichJaffaResultsManagementApp
 */
angular.module('ipswichJaffaResultsManagementApp')
.controller('ResultCtrl', ['$scope', '$filter', '$uibModal', '$log', 'dataFactory', 'utilityFactory', 'results', 'runners', 'events', function ($scope, $filter, $uibModal, $log, dataFactory, utilityFactory, results, runners, events) {

			$scope.currentPage = 1;
			$scope.pageSize = 10;
			$scope.collapseAddResultsForm = true;
			$scope.collapseSearchResultsForm = true;
			
			$scope.runners = runners.data;
			$scope.currentRunners = $filter('filter')($scope.runners, {
							isCurrentMember : '1'
						}, true);
			$scope.results = results.data;
			$scope.events = events.data;
			$scope.newResult = {};
			$scope.courses = {};
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
			
			$scope.updateCourseList = function () {
				if (typeof $scope.newResult.eventId === "undefined" ||
					$scope.newResult.eventId < 1)
					return;
				
				dataFactory.getCourses($scope.newResult.eventId)
				.then(
					function (data) {
					$scope.courses = data.data;					
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

			$scope.saveResult = function () {
				var result = {};
				result.position = $scope.newResult.position;
				result.info = $scope.newResult.info;
				result.runnerId = $scope.newResult.runner.id;
				result.eventId = $scope.newResult.eventId;
				result.time = $scope.newResult.time;
				result.date = utilityFactory.formatDate($scope.newResult.date);
				result.courseId = $scope.newResult.courseId;
				result.isGrandPrixResult = $scope.newResult.isGrandPrixResult;
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
				var eventId = $scope.newResult.eventId;
				var isGrandPrixResult = $scope.newResult.isGrandPrixResult;
				$scope.newResult = {};
				$scope.newResult.eventId = eventId;
				$scope.newResult.date = date;
				$scope.newResult.isGrandPrixResult = isGrandPrixResult;
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
