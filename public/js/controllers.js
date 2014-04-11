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
          legend: { enabled: false },
          plotOptions: { spline: { marker: { enabled: false } } }, 
        },
          xAxis: { 
            type: 'datetime',title: { enabled: false, text: 'Date' },
          },
          yAxis: { gridLineWidth: 0, minorGridLineWidth: 0,title: { text: 'Inspections',enabled: false },min: 0},              
        title: { text: 'Inspections Performed' },
        subtitle: { text : '(Last 60 Days)'},
        series: [],
        credits: { enabled: false },
        loading: false
    };
     
  var seriesCreation = function(chartConfig){
     return function(data){
      var seriesObj = [];
      _.each(data,function(item){
        var point = parseInt(item.number_of_reports);
        seriesObj.push([Date.UTC(item._id.year,item._id.month-1,item._id.day),point]); //Month starts at 0....
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
      $scope.markers=[];
      $scope.dc = {};

      var setMarkerLatLng = function(data){
        $scope.markers = [{
                    lat: data[0].lat,
                    lng: data[0].lng,
                    draggable: false
              }];
        $scope.dc = { lat: data[0].lat, lng: data[0].lng, zoom: 12 };
      };

    var seriesCreation = function(chartConfig,data){
      var criticalSeriesObj = [];
      var noncriticalSeriesObj = [];
      _.each(data,function(item){
        var dateVal = Date.parse(item.date_of_inspection);
        var pointC = parseInt(item.critical_violations.total);
        var pointNC = parseInt(item.noncritical_violations.total);

        
        criticalSeriesObj.push([dateVal,pointC]);
        noncriticalSeriesObj.push([dateVal,pointNC]);
      });
      criticalSeriesObj = _.sortBy(criticalSeriesObj,function(item){ return item[0]; });
      noncriticalSeriesObj = _.sortBy(noncriticalSeriesObj,function(item){ return item[0]; });
      chartConfig.series.push({ name: 'Critical Violations', data: criticalSeriesObj });
      chartConfig.series.push({ name: 'Noncritical Violations', data: noncriticalSeriesObj });
   }

      $scope.chartConfig = {
          options: { 
            chart: { type: 'spline' },
            legend: { enabled: true },
            plotOptions: { spline: { marker: { enabled: false } } }, 
          },
            xAxis: { 
              type: 'datetime',title: { enabled: true, text: 'Date of Inspection' },
            },
            yAxis: { gridLineWidth: 0.2, minorGridLineWidth: 1,title: { text: 'Violations',enabled: true },min: 0},              
          title: { text: 'Inspections Over Time' },
          subtitle: { text : $scope.establishment},
          series: [],
          credits: { enabled: false },
          loading: false
      };


      $scope.retrieveData = function(){
        $http.post('/name/',  {establishment_name: $scope.establishment, address: $scope.address } ).     
        success(function (data, status, headers, config) {
          if (! data.length > 0) { console.log('No results for found'); }
          else { 
            _.each(data, function(item){ $scope.inspections.push(item); }); 
            seriesCreation($scope.chartConfig,data);
            console.log(data);
            setMarkerLatLng(data);
          }
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
      $scope.markers=[];
      $scope.dc = {};
      
      var setMarkerLatLng = function(data){
        var latCenter, lngCenter;
        _.each(data, function(x) { 
          if (! isNaN(parseFloat(x._id.lat)) && ! isNaN(parseFloat(x._id.lng))){
          
          $scope.markers.push(
            {
                    lat: x._id.lat,
                    lng: x._id.lng,
                    draggable: false,
                    message: x._id.establishment_name
              }
            )
        }
        });
        
        //$scope.dc = { lat: data[0]._id.lat, lng: data[0]._id.lng, zoom: 12 };
      };


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
            setMarkerLatLng(data);
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
