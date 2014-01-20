var Fiber = require('fibers');
var fs = require('fs');
var _ = require('underscore');

var geocoderProvider = 'openstreetmap';
var httpAdapter = 'http';
var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, null);
var addresses = fs.readFileSync('../scrapy/out.txt').toString().split("\n");


function sleep(ms) {
    var fiber = Fiber.current;
    setTimeout(function() {
        fiber.run();
    }, ms);
    Fiber.yield();
}

Fiber(function() {
	for(i in addresses) {
		var address_str = addresses[i].split(",");
		var address_portion = address_str[0];
		var citystatezip_portion = (address_str[1]+','+address_str[2]).slice(1);
		//console.log(address_portion);
		//console.log(citystatezip_portion);
		
		//console.log(citystatezip_portion);
		
		geocoder.geocode(addresses[i], function(err, res) {
    		var lat,lng;
    		if (res[0] != undefined){
	    		if (res[0].latitude != undefined) lat = parseFloat(res[0].latitude);
	    		if (res[0].longitude != undefined) lng = parseFloat(res[0].longitude);
    		}
    		fs.appendFile('addressesLatLng.txt',address_portion+'|'+citystatezip_portion+'|'+lat+'|'+lng+'\n');
		});
		sleep(1100); 
	}
}).run();