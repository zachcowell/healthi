var Inspections = require('../models/inspections.js');
var _ = require('underscore');
var moment = require('moment');
var request = require('request');


exports.addressLatLng = function(req, res) {
	var q = Inspections.aggregate([{ $group: {"_id": {address: "$address",city: "$city_state_zip"}}}]);
	var post_data = [];
	var reports_affected = 0;	
	q.exec(function (err,data){
		for (x in data) { 
			var addr = data[x]._id.address;
			var csz = data[x]._id.city;

			request.get('http://api.geocod.io/v1/geocode?api_key=2ee87d6bec6e27f6575dc00ded1c28c56ec6856&q='+addr + ', ' + csz,		    
				function (error, response, body) {
				    if (!error && response.statusCode == 200) {
				    	var resp = JSON.parse(body);
				        if (resp.results.length >0){
				        	var lati = parseFloat(resp.results[0].location.lat);
				        	var longi = parseFloat(resp.results[0].location.lng);
				    		Inspections.update(
								{address: addr, city_state_zip: csz},
								{lat: lati, lng: longi},
								{upsert: false, multi: true},
								function(err,numberAffected,rawResponse){
									if (err) console.log(err);
									else { reports_affected += numberAffected; }
								});
				    	}
				    }
				});
		}			
	});

}