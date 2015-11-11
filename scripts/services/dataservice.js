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

	var getCourses = function (eventId) {
		return $http.get(baseUrl + 'events/' + eventId + '/courses');
	};

	var getCourseTypes = function () {
		return $http.get(baseUrl + 'coursetype', {cache:true});
	};

	var getRunners = function () {
		return $http.get(baseUrl + 'runners', {cache:true});
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

	var deleteEvent = function (eventId) {
		var promise = $http.delete (baseUrl + 'events/' + eventId);
		
		var cache = $cacheFactory.get('$http');
		cache.remove(baseUrl + 'events');
  
		return promise;
	};

	var deleteCourse = function (courseId, eventId) {
		return $http.delete (baseUrl + 'events/' + eventId + '/courses/' + courseId);
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

	var saveEvent = function (data) {
		var promise = $http.post(
			baseUrl + 'events', {
			event : data
		});
		
		var cache = $cacheFactory.get('$http');
		cache.remove(baseUrl + 'events');
  
		return promise;
	};

	var saveCourse = function (data, eventId) {
		return $http.post(
			baseUrl + 'events/' + eventId + '/courses', {
			course : data
		});
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

	// Public API here
	return {
		getEvents : getEvents,
		getDistances : getDistances,
		getGenders : getGenders,
		getRunners : getRunners,
		getResults : getResults,
		deleteEvent : deleteEvent,
		deleteRunner : deleteRunner,
		deleteResult : deleteResult,
		deleteCourse : deleteCourse,
		saveEvent : saveEvent,
		saveResult : saveResult,
		saveRunner : saveRunner,
		saveRunnerOfTheMonth : saveRunnerOfTheMonth,
		mergeEvents : mergeEvents,
		getCourses : getCourses,
		saveCourse : saveCourse,
		getCourseTypes : getCourseTypes,
		updateEvent : updateEvent,
		updateRunner : updateRunner,
		updateResult : updateResult
	};
});
