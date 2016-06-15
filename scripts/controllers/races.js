'use strict';

/**
 * @ngdoc function
 * @name ipswichJaffaResultsManagementApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the ipswichJaffaResultsManagementApp
 */
angular.module('ipswichJaffaResultsManagementApp')
.controller('RaceCtrl', ['$scope', '$filter', '$uibModal', '$log', 'dataFactory', 'utilityFactory', 'events', 'distances', 'coursetypes', 'countries', 'counties', 'areas', function ($scope, $filter, $uibModal, $log, dataFactory, utilityFactory, events, distances, coursetypes, countries, counties, areas) {

			$scope.currentPage = 1;
			$scope.pageSize = 10;
			$scope.events = events.data;
			$scope.distances = distances.data;
			$scope.courseTypes = coursetypes.data;
			$scope.countries = countries.data;
			$scope.counties = counties.data;
			$scope.areas = areas.data;				
			$scope.newRace = { };

			$scope.booleanStatuses = [{
					value : 0,
					text : 'No'
				}, {
					value : 1,
					text : 'Yes'
				}
			];

			$scope.showBoolean = function (status) {
				var selected = $filter('filter')($scope.booleanStatuses, {
						value : status
					});
				return (status && selected.length) ? selected[0].text : 'Not set';
			};

			var updateRaceList = function () {
				if (typeof $scope.newRace.eventId === "undefined" ||
					$scope.newRace.eventId < 1)
					return;

				dataFactory.getRaces($scope.newRace.eventId)
				.then(
					function (data) {
					$scope.races = data.data;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.eventChanged = function () {
				var eventId = $scope.newRace.eventId;
				clearNewRaceForm();
				$scope.newRace.eventId = eventId;
				updateRaceList();
			};

			var clearNewRaceForm = function () {				
				$scope.newRace = { eventId: 0 };
			};

			$scope.showCourseType = function (courseTypeId) {
				if (courseTypeId && $scope.courseTypes.length) {
					var selected = $filter('filter')($scope.courseTypes, {
							id : courseTypeId
						}, true);
					return selected.length ? selected[0].description : 'Not set';
				} else {
					return 'Not set';
				}
			};
			
			$scope.showEvent = function (eventId) {
				if (eventId && $scope.events.length) {
					var selected = $filter('filter')($scope.events, {
							id : eventId
						}, true);
					return selected.length ? selected[0].name : 'Not set';
				} else {
					return 'Not set';
				}
			};
			
			$scope.showCountry = function (countryCode) {
				if (countryCode && $scope.countries.length) {
					var selected = $filter('filter')($scope.countries, {
							code : countryCode
						}, true);
					return selected.length ? selected[0].name : 'Not set';
				} else {
					return 'Not set';
				}
			};
			
			$scope.showCounty = function (county) {
				if (county && $scope.counties.length) {
					var selected = $filter('filter')($scope.counties, county, true);
					return selected.length ? selected[0] : 'Not set';
				} else {
					return 'Not set';
				}
			};
			
			$scope.showArea = function (area) {
				if (area && $scope.areas.length) {
					var selected = $filter('filter')($scope.areas, area, true);
					return selected.length ? selected[0] : 'Not set';
				} else {
					return 'Not set';
				}
			};

			$scope.showDistance = function (distance) {
				if (distance && $scope.distances.length) {
					var selected = $filter('filter')($scope.distances, {
							text: distance
						}, true);
					return selected.length ? selected[0].text : 'Not set';
				} else {
					return 'Not set';
				}
			};
			
			$scope.updateRace = function (data, field, raceId) {
				dataFactory.updateRace(raceId, field, data)
				.then(
					function (data) {
					return true;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.updateRaceEvent = function (data, field, race) {
				dataFactory.updateRace(race.id, field, data)
				.then(
					function (data) {					
						var index = $scope.races.indexOf(race);
						if (index >= 0)
							$scope.races.splice(index, 1);
						else
							alert('Failed cannot find item in list');					
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};
			
			$scope.updateRaceCountry = function (data, field, race) {
				dataFactory.updateRace(race.id, field, data)
				.then(
					function (data) {					
						var index = $scope.races.indexOf(race);
						if (index >= 0) {
							$scope.races.splice(index, 1);
							$scope.races.unshift(data.data);
						} else
							alert('Failed cannot find item in list');
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};
			
			$scope.saveRace = function () {
				var race = $scope.newRace;

				race.date = utilityFactory.formatDate(race.date);
				var result = dataFactory.saveRace(race)
					.then(
						function (data) {
						// Add count 0 and update table
						var insertedRace = data.data;
						angular.extend(insertedRace, {
							count : 0
						});
						$scope.races.unshift(insertedRace);
						
						var eventId = $scope.newRace.eventId;
						clearNewRaceForm();
						$scope.newRace.eventId = eventId;
					},
						function (reason) {
						alert('Failed: ' + reason);
					});
			};

			$scope.removeRace = function (race) {
				dataFactory.deleteRace(race.eventId, race.id)
				.then(
					function (data) {
					var index = $scope.races.indexOf(race);
					if (index >= 0)
						$scope.races.splice(index, 1);
					else
						alert('Failed cannot find item in list');
				},
					function (reason) {
					alert('Failed: ' + reason);

				});

				return true;
			};
		}
	]);
