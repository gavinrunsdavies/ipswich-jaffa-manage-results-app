'use strict';

/**
 * @ngdoc service
 * @name ipswichJaffaResultsManagementApp.dataService
 * @description
 * # dataService
 * Factory in the ipswichJaffaResultsManagementApp.
 */
angular.module('ipswichJaffaResultsManagementApp')
.factory('dataFactory', function ($http, $cacheFactory, myConfig) {
	// Service logic
	// ...

	const baseUrl = myConfig.apiUrl;
	
	var getDistances = function () {		
		return $http.get(baseUrl + 'distances', {cache:true});
	};

	var getGenders = function () {
		return $http.get(baseUrl + 'genders', {cache:true});
	};

	var getEvents = function () {
		return $http.get(baseUrl + 'events', {cache:true});
	};
	
	var getRaces = function (eventId) {
		return $http.get(baseUrl + 'events/' + eventId + '/races');
	};

	var getCourseTypes = function () {
		return $http.get(baseUrl + 'coursetypes', {cache:true});
	};

	var getRunners = function () {
		return $http.get(baseUrl + 'runners', {cache:true});
	};
	
	var getMeeting = function (eventId, meetingId) {
		return $http.get(baseUrl + 'events/' + eventId + '/meetings/' + meetingId, {cache:false});
	};
	
	var getMeetings = function (eventId) {
		return $http.get(baseUrl + 'events/' + eventId + '/meetings', {cache:false});
	};
	
	var getMeetingRaces = function (eventId, meetingId) {
		return $http.get(baseUrl + 'events/' + eventId + '/meetings/' + meetingId + '/races', {cache:false});
	};

	var getResults = function (eventId, from, to, limit) {
		var queryString = '?';

		if (!(typeof eventId === "undefined") && eventId > 0)
			queryString += 'eventId=' + eventId;

		if (!(typeof from === "undefined") && from != '') {
			if (queryString[queryString.length - 1] != '?')
				queryString += '&';
			queryString += 'fromDate=' + from;
		}

		if (!(typeof to === "undefined") && to != '') {
			if (queryString[queryString.length - 1] != '?')
				queryString += '&';
			queryString += 'toDate=' + to;
		}

		if (!(typeof limit === "undefined") && limit > 0) {
			if (queryString[queryString.length - 1] != '?')
				queryString += '&';
			queryString += 'numberOfResults=' + limit;
		}

		var url = baseUrl + 'results';
		if (queryString != '?')
			url += queryString;

		return $http.get(url);
	};
	
	var getCountries = function () {
		return $http.get('data/countryCodes.json', {cache:true});
	};
	
	var getEnglishCounties = function () {
		return $http.get('data/englishCounties.json', {cache:true});
	};
	
	var getRaceAreas = function () {
		return $http.get('data/areas.json', {cache:true});
	};

	var deleteEvent = function (eventId) {
		var promise = $http.delete (baseUrl + 'events/' + eventId);
		
		var cache = $cacheFactory.get('$http');
		cache.remove(baseUrl + 'events');
  
		return promise;
	};
	
	var deleteRace = function (eventId, raceId) {
		return $http.delete (baseUrl + 'events/' + eventId + '/race/' + raceId);
	};
	
	var deleteRunner = function (runnerId) {
		var promise = $http.delete (baseUrl + 'runners/' + runnerId);
		
		var cache = $cacheFactory.get('$http');
		cache.remove(baseUrl + 'runners');
		
		return promise;
	};

	var deleteResult = function (resultId) {
		return $http.delete (baseUrl + 'results/' + resultId);
	};
	
	var deleteMeeting = function (eventId, meetingId) {
		return $http.delete (baseUrl + 'events/' + eventId + '/meetings/' + meetingId);
	};

	var saveEvent = function (data) {
		var promise = $http.post(
			baseUrl + 'events', {
			event : data
		});
		
		var cache = $cacheFactory.get('$http');
		cache.remove(baseUrl + 'events');
  
		return promise;
	};
	
	var saveRace = function (data) {
		var promise = $http.post(
			baseUrl + 'races', {
			race : data
		});	
  
		return promise;
	};

	var saveRunner = function (data) {
		var promise = $http.post(baseUrl + 'runners', {
			'runner' : data
		});
		
		var cache = $cacheFactory.get('$http');
		cache.remove(baseUrl + 'runners');
		
		return promise;
	};

	var saveResult = function (data) {
		return $http.post(baseUrl + 'results', {
			'result' : data
		});
	};
	
	var saveMeeting = function (eventId, data) {
		return $http.post(baseUrl + 'events/' + eventId + '/meetings', {
			'meeting' : data
		});
	};
	
	var saveRunnerOfTheMonth = function (data) {
		return $http.post(baseUrl + 'runnerofthemonth', {
			'winners' : data
		});
	};

	var mergeEvents = function (fromEventId, toEventId) {
		var promise = $http.post(
			baseUrl + 'events/merge', {
			'fromEventId' : fromEventId,
			'toEventId' : toEventId
		});
		
		var cache = $cacheFactory.get('$http');
		cache.remove(baseUrl + 'events');
  
		return promise;
	};
	
	var updateEvent = function (eventId, field, value) {
		var promise = $http.patch(baseUrl + 'events/' + eventId, {
			'field' : field,
			'value' : value
		});
		
		var cache = $cacheFactory.get('$http');
		cache.remove(baseUrl + 'events');
  
		return promise;
	};
	
	var updateRace = function (raceId, field, value) {
		var promise = $http.patch(baseUrl + 'races/' + raceId, {
			'field' : field,
			'value' : value
		});
  
		return promise;
	};
	
	var updateRunner = function (runnerId, field, value) {
		var promise = $http.patch(baseUrl + 'runners/' + runnerId, {
			'field' : field,
			'value' : value
		});
		
		var cache = $cacheFactory.get('$http');
		cache.remove(baseUrl + 'runners');
		
		return promise;
	};
	
	var updateResult = function (resultId, field, value) {
		return $http.patch(baseUrl + 'results/' + resultId, {
			'field' : field,
			'value' : value
		});
	};
	
	var updateMeeting = function (eventId, meetingId, field, value) {
		return $http.patch(baseUrl + 'events/' + eventId + '/meetings/' + meetingId, {
			'field' : field,
			'value' : value
		});
	};

	// Public API here
	return {
		getEvents : getEvents,
		getDistances : getDistances,
		getRaces : getRaces,
		getGenders : getGenders,
		getRunners : getRunners,
		getResults : getResults,
		getCountries : getCountries,
		getEnglishCounties : getEnglishCounties,
		getRaceAreas : getRaceAreas,
		getMeeting : getMeeting,
		getMeetings : getMeetings,
		getMeetingRaces: getMeetingRaces,
		getCourseTypes : getCourseTypes,
		deleteEvent : deleteEvent,
		deleteRace : deleteRace,
		deleteRunner : deleteRunner,
		deleteResult : deleteResult,
		deleteMeeting : deleteMeeting,
		saveEvent : saveEvent,
		saveResult : saveResult,
		saveRunner : saveRunner,
		saveMeeting : saveMeeting,
		saveRunnerOfTheMonth : saveRunnerOfTheMonth,
		saveRace : saveRace,
		mergeEvents : mergeEvents,			
		updateEvent : updateEvent,
		updateRunner : updateRunner,
		updateResult : updateResult,
		updateRace: updateRace,
		updateMeeting: updateMeeting
	};
});
