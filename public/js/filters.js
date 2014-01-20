'use strict';

angular.module('myApp.filters', []).
	filter('startFrom', function() {
	return function(input, start) {
	    start = +start; 
	    return input.slice(start);
	}
}).
	filter('roundUp', function() {
	return function(input) { return Math.ceil(input); }
});