'use strict';

/**
 * @ngdoc function
 * @name ipswichJaffaResultsManagementApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the ipswichJaffaResultsManagementApp
 */
angular.module('ipswichJaffaResultsManagementApp')
.controller('EventCtrl', ['$scope', '$filter', '$uibModal', '$log', 'dataFactory', 'events', 'distances', 'coursetypes', function ($scope, $filter, $uibModal, $log, dataFactory, events, distances, coursetypes) {

			$scope.currentPage = 1;
			$scope.pageSize = 10;
			$scope.events = events.data;
			$scope.distances = distances.data;
			$scope.courseTypes = coursetypes.data;
			$scope.courses = [];
			$scope.newEvent = {};
			$scope.newCourse = {};
			$scope.showAddCourseForm = false;

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

			$scope.showDistance = function (event) {
				if (event.distance_id && $scope.distances.length) {
					var selected = $filter('filter')($scope.distances, {
							id : event.distance_id
						}, true);
					return selected.length ? selected[0].text : 'Not set';
				} else {
					return event.distance || 'Not set';
				}
			};

			$scope.showCourseType = function (course) {
				if (course.typeId && $scope.courseTypes.length) {
					var selected = $filter('filter')($scope.courseTypes, {
							id : course.typeId
						}, true);
					return selected.length ? selected[0].description : 'Not set';
				} else {
					return course.description || 'Not set';
				}
			};

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

			$scope.mergeEvents = function () {
				if ($scope.fromEvent == $scope.toEvent) {
					alert('Events must be different!');
					return;
				}
				dataFactory.mergeEvents($scope.fromEvent, $scope.toEvent)
				.then(
					function (data) {
					// Remove fromEventId from table

				},
					function (reason) {
					alert('Failed: ' + reason);
				});

				return true;
			};

			$scope.removeEvent = function (event) {
				//$scope.openDeleteConfirmationDialog(); TODO
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

			/*{
			"name": "Abingdon Marathon",
			"id": "2",
			"eventId": "1",
			"typeId": "1",
			"registeredDistance": "1",
			"certifiedAccurate": "1",
			"courseNumber": "2014379",
			"area": "South",
			"county": "Oxfordshire",
			"country_code", "GB"
			}*/

			$scope.updateCourseList = function () {
				dataFactory.getCourses($scope.courseEvent)
				.then(
					function (data) {
					$scope.courses = data.data;
					$scope.newCourse = {};
					$scope.newCourse.eventId = $scope.courseEvent;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.saveCourse = function () {
				dataFactory.saveCourse($scope.newCourse, $scope.newCourse.eventId)
				.then(
					function (data) {
					$scope.courses.unshift(data.data);
					$scope.showAddCourseForm = false;
					$scope.newCourse = {};
				},
					function (reason) {
					alert('Failed: ' + reason);
				});

				return true;
			};

			$scope.removeCourse = function (course) {
				dataFactory.deleteCourse(course.id, course.eventId)
				.then(
					function (data) {
					var index = $scope.courses.indexOf(course);
					if (index >= 0)
						$scope.courses.splice(index, 1);
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
