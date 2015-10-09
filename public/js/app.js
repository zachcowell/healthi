'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'ngRoute',
  'ui.bootstrap',
  'leaflet-directive',
  'highcharts-ng'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/search/:searchterm', {
      templateUrl: 'partials/search',
      controller: 'SearchCtrl'
    }).
    when('/establishment/:establishment/:address', {
      templateUrl: 'partials/establishment',
      controller: 'EstablishmentCtrl'
    }).
    when('/splash', {
      templateUrl: 'partials/splash'
    }).
    when('/', {
      templateUrl: 'partials/main',
      controller: 'MainCtrl'
    });/*.
    otherwise({
      redirectTo: '/'
    })*/;

  $locationProvider.html5Mode(true);
});
