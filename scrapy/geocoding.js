var Inspections = require('../models/inspections.js');
var _ = require('underscore');
var Geocodio = require('geocodio');
var fs = require('fs');
var	mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/healthi'); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () { 
	console.log('Database opened'); 

	var pwd = fs.readdirSync('../geocoding/');
	console.log('insertion begin');
	_.each(pwd,function(item){ 
		if (item.substr(-4) == 'json' && item != 'package.json') {
			var response = JSON.parse(fs.readFileSync('../geocoding/'+item,'utf8')); 
			_.each(response.results,function(item){ 
				if (item.response.results != undefined){
					if (item.response.results.length > 0){ 
						var query = item.query.split(",");
						if (query.length == 3){
							var csz = (query[1] +','+ query[2]).trim();
							var addr = query[0];
						}
						else {
							var csz = (query[2] +','+ query[3]).trim();
							var addr = query[0] +','+ query[1];
						}			
						var lati = parseFloat(item.response.results[0].location.lat);
						var longi = parseFloat(item.response.results[0].location.lng);
						Inspections.update({address: addr, city_state_zip: csz},{lat: lati, lng: longi}, { multi: true }, function (err, numberAffected, raw) {
						  if (err) console.log(err)
						  console.log('The number of updated documents was %d', numberAffected);
						  console.log('The raw response from Mongo was ', raw);
						});
					}
				}
			});

		}
	});
});
