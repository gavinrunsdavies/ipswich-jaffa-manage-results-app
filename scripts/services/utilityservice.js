'use strict';

/**
 * @ngdoc utilityFactory
 * @name ipswichJaffaResultsManagementApp.utilityFactory
 * @description
 * # utilityFactory
 * Factory in the ipswichJaffaResultsManagementApp.
 */
angular.module('ipswichJaffaResultsManagementApp')
.factory('utilityFactory', function () {

	var formatDate = function formatDate(date) {
		if (typeof date === "undefined")
			return;
		
		var month = '' + (date.getMonth() + 1),
		day = '' + date.getDate(),
		year = date.getFullYear();

		if (month.length < 2)
			month = '0' + month;
		if (day.length < 2)
			day = '0' + day;

		return [year, month, day].join('-');
	};

	// Public API here
	return {
		formatDate : formatDate
	};
});
