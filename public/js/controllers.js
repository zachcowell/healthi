'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MainCtrl', function ($scope, $routeParams, $http) {
      $scope.isCollapsed= false;
      $scope.restaurants = [];
      $scope.totalItems = $scope.restaurants.length;
      $scope.currentPage = 0;
      $scope.maxSize = 6;
      
      $scope.setPage = function (pageNo) { $scope.currentPage = pageNo; };

      $scope.dc = { lat: 38.891121, lng: -77.041481, zoom: 12 };
      $scope.mapDefaults = {
        tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
        zoomControlPosition: 'topright',
        tileLayerOptions: { opacity: 0.9, detectRetina: true, reuseTiles: true },
        scrollWheelZoom: false
      };

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
