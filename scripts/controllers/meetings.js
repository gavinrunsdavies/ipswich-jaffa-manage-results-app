'use strict';

/**
 * @ngdoc function
 * @name ipswichJaffaResultsManagementApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the ipswichJaffaResultsManagementApp
 */
angular.module('ipswichJaffaResultsManagementApp')
.controller('MeetingCtrl', ['$scope', '$filter', '$uibModal', '$log', 'dataFactory', 'utilityFactory', 'events', function ($scope, $filter, $uibModal, $log, dataFactory, utilityFactory, events) {

			$scope.currentPage = 1;
			$scope.pageSize = 10;
			$scope.events = events.data;
			$scope.meetings = [];
			$scope.races = [];
			$scope.meetingRaces = [];
			$scope.newMeeting = {};
			$scope.eventId;
			$scope.meetingId;

			$scope.eventChanged = function () {
				clearNewMeetingForm();
				$scope.meetingId = 0;
				$scope.meetings = [];
				$scope.meetingRaces = [];
				$scope.races = [];
				updateMeetingsList();
				updateRaceList();
			};

			var clearNewMeetingForm = function () {
				$scope.newMeeting = {};
			};

			var updateMeetingsList = function () {
				if (typeof $scope.eventId === "undefined" ||
					$scope.eventId < 1)
					return;

				dataFactory.getMeetings($scope.eventId)
				.then(
					function (data) {
					if (data.data != null) {
						$scope.meetings = data.data;
					}
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
					if (data.data != null) {
						$scope.races = data.data;
					}
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			var updateMeetingRacesList = function () {
				$scope.meetingRaces = [];
				if (typeof $scope.meetingId === "undefined" ||
					$scope.meetingId < 1)
					return;

				dataFactory.getMeetingRaces($scope.eventId, $scope.meetingId)
				.then(
					function (data) {
					if (data.data != null) {
						$scope.meetingRaces = data.data;
					}
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.updateMeetingName = function (data, meetingId) {
				if (data.length < 3) {
					return "Invalid meeting name; name must be at least 2 characters long.";
				}

				dataFactory.updateMeeting($scope.eventId, meetingId, 'name', data)
				.then(
					function (data) {
					return true;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.updateMeetingFromDate = function (data, meetingId) {
				var date = utilityFactory.formatDate(data);
				dataFactory.updateMeeting($scope.eventId, meetingId, 'from_date', date)
				.then(
					function (data) {
					return true;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.updateMeetingToDate = function (data, meetingId) {
				var date = utilityFactory.formatDate(data);
				dataFactory.updateMeeting($scope.eventId, meetingId, 'to_date', date)
				.then(
					function (data) {
					return true;
				},
					function (reason) {
					alert('Failed: ' + reason);
				});
			};

			$scope.saveMeeting = function () {
				var meeting = $scope.newMeeting;

				meeting.fromDate = utilityFactory.formatDate(meeting.fromDate);
				meeting.toDate = utilityFactory.formatDate(meeting.toDate);
				var result = dataFactory.saveMeeting($scope.eventId, meeting)
					.then(
						function (data) {
						$scope.meetings.unshift(data.data);
					},
						function (reason) {
						alert('Failed: ' + reason);
					});
			};

			$scope.removeMeeting = function (meeting) {
				dataFactory.deleteMeeting($scope.eventId, meeting.id)
				.then(
					function (data) {
					var index = $scope.meetings.indexOf(meeting);
					if (index >= 0)
						$scope.meetings.splice(index, 1);
					else
						alert('Failed cannot find item in list');
				},
					function (reason) {
					alert('Failed: ' + reason);
				});

				return true;
			};

			$scope.selectMeeting = function (meeting) {
				$scope.meetingId = meeting.id;
				angular.extend(meeting, {
					selected : true
				});
				updateMeetingRacesList();
				return true;
			};

			$scope.raceAssociated = function (event, index, item, external, type, allowedType) {
				console.log("raceAssociated: " + item);

				dataFactory.updateRace(item.id, 'meeting_id', $scope.meetingId)
				.then(
					function (data) {
					// Set meetingId on available races to exclude via filter
					for (var i = 0; i < $scope.races.length; i++) {
						if ($scope.races[i].id == item.id) {
							$scope.races[i].meetingId = $scope.meetingId;
							break;
						}
					}		
					
					// Add race
					$scope.meetingRaces.unshift(data.data);
					return item;
				},
					function (reason) {
					alert('Failed: ' + reason);
					return false;
				});
			};

			$scope.raceDisassociated = function (event, index, item, external, type, allowedType) {
				console.log("raceDisassociated: " + item);

				dataFactory.updateRace(item.id, 'meeting_id', 0)
				.then(
					function (data) {
					// Update meetingId on available races
					for (var i = 0; i < $scope.races.length; i++) {
						if ($scope.races[i].id == item.id) {
							$scope.races[i].meetingId = 0;
							break;
						}
					}

					// Remove item from meeting races
					for (var i = 0; i < $scope.meetingRaces.length; i++) {
						if ($scope.meetingRaces[i].id == item.id) {
							$scope.meetingRaces.splice(i, 1);
							break;
						}
					}				

					return item;
				},
					function (reason) {
					alert('Failed: ' + reason);
					return false;
				});
			};

			$scope.raceFilter = function () {
				return function (item) {
					return item.meetingId == 0 || item.meetingId == null || item.meetingId == "0";
				};
			};
		}
	]);
