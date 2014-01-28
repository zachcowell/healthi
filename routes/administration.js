var Inspections = require('../models/inspections.js');
var _ = require('underscore');
var moment = require('moment');
var request = require('request');
var Geocodio = require('geocodio');

exports.geocoding = function(req,res){
	var geocodio = new Geocodio({ api_key: '2ee87d6bec6e27f6575dc00ded1c28c56ec6856' });

	var q = Inspections.aggregate([
		{ $match : { lat: null, lng: null } }, 
		{ $group: {"_id": {address: "$address",city: "$city_state_zip"}} }
	]);
	var post_data = [];
	var reports_affected = 0;	
	var i = 0;

	q.exec(function (err,data){
		for (x in data) { 
			i++;
			if (i < 2){
				post_data.push({
					address: data[x]._id.address,
					city: data[x]._id.city,
					full: data[x]._id.address + ', ' + data[x]._id.city,
					lat: null,
					lng: null
				});
			}
		}			
	})
	.then(function(){
		_.each(post_data,function(item){
			geocodio.geocode(item.full, function(err, response){
    			if (err) console.log(err);
    			else {
    				if (response.results.length > 0){
    					var resp = response.results[0].response.results[0];
		    			item.lat = parseFloat(resp.location.lat);
		    			item.lng = parseFloat(resp.location.lng);
	    			}
    				
	    		}
			});
		});
	})
	/*.then(function(){
		_.each(post_data,function(item){
			Inspections.update(
	            {address: item.address, city_state_zip: item.city},
	            {lat: item.lat, lng: item.lng},
	            {upsert: false, multi: true},
	            function(err,numberAffected,rawResponse){
	                    if (err) console.log(err);
	            });
		});
	})*/
	.then(function(){
		res.send(post_data);
	});


}