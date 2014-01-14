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
        else { 
          $scope.restaurants = data 
        }        
      }).
      error(function (data, status, headers, config) {
        $scope.name = 'Error!'
      });
    }();
  }).
    controller('PestCtrl', function ($scope, $routeParams, $http) {
      $scope.currentPage = 0;
      $scope.pageSize = 10;
      $scope.restaurants = [];
      $scope.filteredItems = [];
      $scope.numberOfPages=function(){
          return Math.ceil($scope.filteredItems.length/$scope.pageSize);                
      }

      $scope.retrieveData = function(){
      var words = ['dropping','roach','mice','rodent','feces','mouse'];
      $http.post('/pests/',  {keywords: words}).     
      success(function (data, status, headers, config) {
        if (! data.length > 0) { console.log('No results for found'); }
        else { $scope.restaurants = data; $scope.filteredItems = $scope.restaurants; }      
      }).
      error(function (data, status, headers, config) {
        $scope.name = 'Error!'
      });
    }();
  });
