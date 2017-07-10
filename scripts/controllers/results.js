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
			$scope.collapseImportResultsForm = true;
			$scope.collapseSearchResultsForm = true;
			$scope.collapseImportedResultsForm = true;
			$scope.eventId = 0;
			$scope.race = {};			
			$scope.resultPlaceHolderText;
			$scope.runners = runners.data;
			$scope.currentRunners = $filter('filter')($scope.runners, {
							isCurrentMember : '1'
						}, true);
			$scope.results = results.data;
			$scope.events = events.data;
			$scope.newResult = {};
			$scope.races = {};
			$scope.findResultsPromise;
			
			$scope.importResultFields = ['Name', 'Position', 'Time', 'Info'];			
			$scope.importMatchedFields = [];
			$scope.importedData = [];
			$scope.importedMatchedResults = [];
			
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
			
			$scope.showResultPlaceHolderText = function(resultMeasurementUnitTypeId) {
				if ($scope.race.resultMeasurementUnitTypeId == 1) 
					return "Time. Format: hh:mm:ss or mm:ss";
				if ($scope.race.resultMeasurementUnitTypeId == 2) 
					return "Time in seconds e.g. 12.3";
				if ($scope.race.resultMeasurementUnitTypeId == 3) 
					return "Distance in meters e.g. 2.3";
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
			
			$scope.loadResults = function () {	
				
				dataFactory.loadResults($scope.resultsFile, $scope.numberOfHeaderRows)
				.then(
					function (data) {
						$scope.importedData = data.data;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			}
			
			$scope.clearImportedResults = function () {
				$scope.importedData = [];
				$scope.collapseImportResultsForm = true;
			}
			
			$scope.matchRunnersForImportedDataResults = function () {
				for (var i = 0; i < $scope.importedData.length; i++) {
					
					var importedResult = {};
					var add = false;
					
					// Position
					var positionIndex = $scope.importMatchedFields.indexOf('Position');
					if (positionIndex >= 0) {
						importedResult.position = parseInt($scope.importedData[i][positionIndex]);
					}
					
					// Time
					var timeIndex = $scope.importMatchedFields.indexOf('Time');
					if (timeIndex >= 0) {
						importedResult.result = $scope.importedData[i][timeIndex];
					}
					
					// Info
					var infoIndex = $scope.importMatchedFields.indexOf('Info');
					if (infoIndex >= 0) {
						importedResult.info = $scope.importedData[i][infoIndex];
					}
					
					// Runner
					var nameIndex = $scope.importMatchedFields.indexOf('Name');
					if (nameIndex >= 0) {
						importedResult.runnerName = $scope.importedData[i][nameIndex].trim();
						importedResult.runnerId = getRunnerId($scope.importedData[i][nameIndex]);
						add = true;
					}
					
					if (add) {
						$scope.importedMatchedResults.unshift(importedResult);
					}					
				}
				
				if ($scope.importedMatchedResults.length > 0) {
					$scope.collapseImportedResultsForm = false;
				}
			}
			
			$scope.saveImportedResults = function () {
				var copyOfResults = $scope.importedMatchedResults;
				for (var i = 0; i < copyOfResults.length; i++) {
					var currentResult = copyOfResults[i];
					if (currentResult.runnerId > 0) {
						var result = {};
						result.eventId = $scope.eventId;
						result.raceId = $scope.race.id;					
						result.position = currentResult.position;
						result.info = currentResult.info;
						result.runnerId = currentResult.runnerId;
						result.result = currentResult.result;
						result.date = $scope.race.date;
						result.courseId = $scope.race.courseId;
						result.isGrandPrixResult = $scope.race.isGrandPrixRace;
						result.team = currentResult.team;				
						
						if (typeof result.courseId === "undefined")
							result.courseId = 0;
						if (typeof result.isGrandPrixResult === "undefined")
							result.isGrandPrixResult = 0;
						if (typeof result.result !== "undefined" && $scope.race.resultMeasurementUnitTypeId == 1) {
							var parts = result.result.split(':');
							if ( parts.length == 1) { // ss 
								result.result = "00:00:" + padTime(parts[0]);		
							} else if (parts.length == 2) { // mm:ss						
								result.result = "00:" + padTime(parts[0]) + ":" + padTime(parts[1]);		
							} else if (parts.length == 3) { // hh:mm:ss						
								result.result = padTime(parts[0]) + ":" + padTime(parts[1]) + ":" + padTime(parts[2])		
							}
						}					
						
						dataFactory.saveResult(result)
						.then(
							function (data) {
							// Update committed results table
							addResult(data.data);
							
							// Remove from preview table
							var index = $scope.importedMatchedResults.indexOf(result);
							$scope.importedMatchedResults.splice(index, 1);
						},
							function (reason) {
							alert('Failed: ' + reason);
						});
					}
				}
			}
			
			var padTime = function (units) {
				var padding = "00";
				return padding.substring(units.length) + units;
			}				
			
			$scope.removeImportedResult = function (result) {
			
				var index = $scope.importedMatchedResults.indexOf(result);
				if (index >= 0)
					$scope.importedMatchedResults.splice(index, 1);
				else
					alert('Failed cannot find item in list');
			
				return true;
			};
			
			var getRunnerId = function (name) {
				var normalisedName = name.toLowerCase().replace(/\s+/g, ' ').trim();;
				for (var i = 0; i < $scope.runners.length; i++) {
					var runner = $scope.runners[i];					
					if (runner.name.toLowerCase().replace(/\s+/g, ' ').trim() == normalisedName)
						return runner.id;
				};
				
				return 0;
			};
			
			$scope.saveResult = function () {
				var result = {};
				result.eventId = $scope.eventId;
				result.raceId = $scope.race.id;
				
				result.position = $scope.newResult.position;
				result.info = $scope.newResult.info;
				result.runnerId = $scope.newResult.runner.id;
				result.result = $scope.newResult.result;
				result.date = $scope.race.date;
				result.courseId = $scope.race.courseId;
				result.isGrandPrixResult = $scope.race.isGrandPrixRace;
				result.team = $scope.newResult.team;				
				
				if (typeof result.courseId === "undefined")
					result.courseId = 0;
				if (typeof result.isGrandPrixResult === "undefined")
					result.isGrandPrixResult = 0;
				if (typeof result.result !== "undefined") {
					if ($scope.race.resultMeasurementUnitTypeId == 1 && result.result.length == 5) { // hh:mm:ss						
						result.result = "00:" + result.result;			
					}
				}					
					
				// Clear form
				clearNewResultsForm();
				
				$scope.focusInput=true;
				
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
					raceId : result.raceId,
					runnerId : result.runnerId,
					position : result.position,
					courseId : result.courseId,
					result : result.result,
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
				$scope.newResult.isGrandPrixResult = $scope.race.isGrandPrixRace;
			};

			$scope.updateResult = function (field, value, resultId) {
				if (field == 'result' && $scope.race.resultMeasurementUnitTypeId == 1 && value.length == 5) { // hh:mm:ss						
						value = "00:" + value;
				}
					
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
