'use strict';

angular.module('myApp.controllers', [])
  .controller('HeaderCtrl', function ($scope, $location, $routeParams, $http) {
    $scope.go = function (path) { $location.path( path ); };

    $scope.getLocation = function(val) {
        return $http.post('/restaurantNames', {
            establishment_name: val
        }).then(function(res){
          var establishments = [];
          _.each(res.data, function(item){ 
            item = item.toLowerCase().replace(/\b[a-z]/g, function(letter) { return letter.toUpperCase(); });
            item = item.replace("'S","'s"); //Mcdonald'S becomes Mcdonald's
            establishments.push(item); 
          })
          return _.sortBy(establishments,function(item) { return item; } );
        });
      };
  })
  .controller('MainCtrl', function ($scope, $routeParams, $http) {
  
  })  
  .controller('EstablishmentCtrl', function ($scope, $routeParams, $http) {
    $scope.retrieveData = function(){
        $http.post('/find/',  {establishment_name: $routeParams.searchterm}).     
        success(function (data, status, headers, config) {
          
          if (! data.length > 0) { console.log('No results for found'); }
          else { 
            _.each(data, function(item){
              $scope.restaurants.push(item._id);
          });
            //$scope.restaurants = _.sortBy($scope.restaurants,function(item) { return item.index; } );
          }
        }).
        error(function (data, status, headers, config) {
          $scope.name = 'Error!'
        });
  })
  .controller('SearchCtrl', function ($scope, $routeParams, $http) {
      $scope.isCollapsed= true;
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
          else { 
            _.each(data, function(item){
              $scope.restaurants.push(item._id);
          });
            //$scope.restaurants = _.sortBy($scope.restaurants,function(item) { return item.index; } );
          }
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
