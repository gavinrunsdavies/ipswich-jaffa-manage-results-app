'use strict';

angular.module('ipswichJaffaResultsManagementApp')
.filter('hasIntersection', function() {			
	return function(input, array) {
	  return array.indexOf(input) >= 0;
	};    
});