var Inspections = require('../models/inspections.js');
var _ = require('underscore');
var moment = require('moment');
var request = require('request');
var Geocodio = require('geocodio');

exports.geocoding = function(req,res){
	var geocodio = new Geocodio({ api_key: '2ee87d6bec6e27f6575dc00ded1c28c56ec6856' });

	var q = Inspections.aggregate([{ $group: {"_id": {address: "$address",city: "$city_state_zip"}}}]);
	var post_data = [];
	var reports_affected = 0;	
	var i = 0;

	q.exec(function (err,data){
		for (x in data) { 
			i++;
			if (i < 4){
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
			item.lat = 300;
			item.lng = 500;
		});
	})
	.then(function(){
		console.log(post_data);
	})
	.then(function(){
		_.each(post_data,function(item){
			Inspections.update(
	            {address: item.address, city_state_zip: item.city},
	            {lat: item.lat, lng: item.lng},
	            {upsert: false, multi: true},
	            function(err,numberAffected,rawResponse){
	                    if (err) console.log(err);
	                    else { 
	                    	reports_affected += parseInt(numberAffected); 
	                    	console.log(reports_affected);
	                    }
	            });
		});
	})
	.then(function(){
		res.send('Reports affected: ' + reports_affected);
	});


}