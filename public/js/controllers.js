'use strict';

angular.module('myApp.controllers', [])
  .controller('HeaderCtrl', function ($scope, $location, $routeParams, $http) {
    $scope.go = function (path) { $location.path( path ); };

    $scope.getLocation = function(val) {
        return $http.post('/restaurantNames', {
            establishment_name: val
        }).then(function(res){
          var establishments = [];
          _.map(res.data, function(item){ 
            item = item.toLowerCase().replace(/\b[a-z]/g, function(letter) { return letter.toUpperCase(); });
            item = item.replace("'S","'s");
            establishments.push(item); 
            
          })
          return establishments;
        });
      };
  })
  .controller('MainCtrl', function ($scope, $routeParams, $http) {
  
  })
  .controller('SearchCtrl', function ($scope, $routeParams, $http) {
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
        $http.post('/find/',  {establishment_name: $routeParams.searchterm}).     
        success(function (data, status, headers, config) {
          if (! data.length > 0) { console.log('No results for found'); }
          else { $scope.restaurants = data; $scope.filteredItems = $scope.restaurants; }      
        }).
        error(function (data, status, headers, config) {
          $scope.name = 'Error!'
        });
        /*var words = ['dropping','roach','mice','rodent','feces','mouse'];
        $http.post('/pests/',  {keywords: words}).     
        success(function (data, status, headers, config) {
          if (! data.length > 0) { console.log('No results for found'); }
          else { $scope.restaurants = data; $scope.filteredItems = $scope.restaurants; }      
        }).
        error(function (data, status, headers, config) {
          $scope.name = 'Error!'
        });*/
    }();
  });
