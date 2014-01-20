'use strict';

angular.module('myApp.controllers', [])
  .controller('HeaderCtrl', function ($scope, $location, $routeParams, $filter, $http) {
    $scope.go = function (path) { $location.path( path ); };

    $scope.getLocation = function(val) {
        return $http.post('/restaurantNames', {
            establishment_name: val
        }).then(function(res){
          var establishments = [];
          _.each(res.data, function(item){ 
            item = $filter('properCase')(item);
            establishments.push(item); 
          })
          return _.sortBy(establishments,function(item) { return item; } );
        });
      };
  })
  .controller('MainCtrl', function ($scope, $routeParams, $http) {
    $scope.latest=[];
    $scope.worstRestaurantsAvg=[];
    $scope.worstRecentInspections=[];
    $scope.worstInspections=[];
    $scope.worstRepeats=[];
    $scope.violationTimeseries =[];

    $scope.chartConfig = {
        options: { 
          chart: { type: 'spline' },
          legend: { enabled: true },
          plotOptions: { spline: { marker: { enabled: false } } }, 
        },
          xAxis: { type: 'datetime',title: { enabled: true, text: 'Year' },
          },
          yAxis: { title: { text: 'Rank' },min: 0},              
        title: { text: 'Inspections Over Time' },
        series: [],
        credits: { enabled: false },
        loading: false
    };
     
  var seriesCreation = function(chartConfig){
     return function(data){
      var seriesObj = [];
      _.each(data,function(item){
        console.log(Date.parse(item._id.year,item._id.month,item._id.day));
        //var newdate = new Date(item._id.year,item._id.month,item._id.day);
        //var converted = moment(newdate).format("MM/DD/YYYY");
        var point = parseInt(item.number_of_reports);
        seriesObj.push([Date.UTC(item._id.year,item._id.month,item._id.day),point]);
      });
      seriesObj = _.sortBy(seriesObj,function(item){ return item[0]; });
      chartConfig.series.push({ name: 'Inspections', data: seriesObj });
     } 
   }

    $scope.fetch = function(endpoint,array,callback){
      if (callback == undefined){ var func = function (data, status, headers, config) {
          if (! data.length > 0) { console.log('No results for found'); }
          else { _.each(data, function(item){ array.push(item); }); }
        } 
      }
      else { var func = callback; }

      $http.get(endpoint).     
        success(func).error(function (data, status, headers, config) {});
    }

    $scope.fetch('/latest/',$scope.latest);
    $scope.fetch('/worst/restaurantsavg/',$scope.worstRestaurantsAvg);
    $scope.fetch('/worst/recentinspection/',$scope.worstRecentInspections);
    $scope.fetch('/worst/inspections/',$scope.worstInspections);
    $scope.fetch('/worst/repeatcriticals/',$scope.worstRepeats);
    $scope.fetch('/timeseries/violation/',$scope.violationTimeseries,seriesCreation($scope.chartConfig));

    
  })  
  .controller('EstablishmentCtrl', function ($scope, $routeParams, $http) {
      $scope.establishment = $routeParams.establishment;
      $scope.address = $routeParams.address;
      $scope.inspections = [];
      $scope.retrieveData = function(){
        $http.post('/name/',  {establishment_name: $scope.establishment, address: $scope.address } ).     
        success(function (data, status, headers, config) {
          if (! data.length > 0) { console.log('No results for found'); }
          else { _.each(data, function(item){ $scope.inspections.push(item); }); }
        }).
        error(function (data, status, headers, config) {
          $scope.name = 'Error!'
        });
      }();
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
              $scope.restaurants.push(item);
          });
            //$scope.restaurants = _.sortBy($scope.restaurants,function(item) { return item.index; } );
          }
        }).
        error(function (data, status, headers, config) {
          $scope.name = 'Error!'
        });
        /*var words = ['dropping','roach','mice','rodent','feces','mouse'];
        $http.post('/keywordSearch/',  {keywords: words}).     
        success(function (data, status, headers, config) {
          if (! data.length > 0) { console.log('No results for found'); }
          else { $scope.restaurants = data; $scope.filteredItems = $scope.restaurants; }      
        }).
        error(function (data, status, headers, config) {
          $scope.name = 'Error!'
        });*/
    }();
  });
