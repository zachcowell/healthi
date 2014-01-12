'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MainCtrl', function ($scope, $routeParams, $http) {
      $scope.retrieveData = function(){
      $http({
        method: 'GET',
        url: '/top20/'
      }).     
      success(function (data, status, headers, config) {
        if (! data.length > 0) { console.log('No results for found'); }
        else { $scope.restaurants = data }        
      }).
      error(function (data, status, headers, config) {
        $scope.name = 'Error!'
      });
    }();
  });
