'use strict';

angular.module('myApp.filters', []).
	filter('startFrom', function() {
	return function(input, start) {
	    start = +start; 
	    return input.slice(start);
	}
});