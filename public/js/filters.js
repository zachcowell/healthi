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
}).
	filter('properCase', function() {        
		return function(input) { 
			input = input.toLowerCase().replace(/\b[a-z]/g, function(letter) { return letter.toUpperCase(); });
			input = input.replace("'S","'s"); //Mcdonald'S becomes Mcdonald's
			return input;
		}
});