(function() {
	 /**
     * Config
     */
    //var moduleName = 'angularUtils.directives.dateCalculations';    
	var moduleName = 'ipswichJaffaResultsManagementApp';

    /**
     * Module
     */
    var module;
    try {
        module = angular.module(moduleName);
    } catch(err) {
        // named module does not exist, so create one
        module = angular.module(moduleName, []);
    }
	
	module
		.directive('yearDrop', yearDrop)
		.directive('monthDrop', monthDrop);
	
	
	function monthDrop() {
		
		var months = [{id : 0, text : 'January'},
		{id : 1, text : 'February'},
		{id : 2, text : 'March'},
		{id : 3, text : 'April'},
		{id : 4, text : 'May'},
		{id : 5, text : 'June'},
		{id : 6, text : 'July'},
		{id : 7, text : 'August'},
		{id : 8, text : 'September'},
		{id : 9, text : 'October'},
		{id : 10, text : 'November'},
		{id : 11, text : 'December'}];				
		
		return {	
			link: function(scope,element,attrs){
				$scope.months = months;
				$scope.month = new Date().getMonth();
			},
			template: '<select ng-model="month" ng-options="m.id as m.text for m in months"></select>'		
			
		}
	}
	
	function yearDrop() {
		var currentYear = new Date().getFullYear();
		return {
			link: function(scope,element,attrs){
				scope.years = [];
				for (var i = +attrs.offset; i < +attrs.range + 1; i++){
					scope.years.push(currentYear - i);
				}
				scope.year = currentYear;
			},
			template: '<select ng-model="year" ng-options="y for y in years"></select>'
		}
	}
});