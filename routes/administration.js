var Inspections = require('../models/inspections.js');
var _ = require('underscore');
var Geocodio = require('geocodio');
var fs = require('fs');

exports.geocoding = function(req,res){
	var geocodio = new Geocodio({ api_key: '2ee87d6bec6e27f6575dc00ded1c28c56ec6856' });

	var q = Inspections.aggregate([
		{ $match : { lat: null, lng: null } }, 
		{ $group: {"_id": {address: "$address",city: "$city_state_zip"}} },
		{ $limit: 1000 }
	]);
	
	q.exec(function (err,data){
		var post_data = [];
		_.each(data,function(item){ post_data.push(item._id.address + ', ' + item._id.city); });
		
		geocodio.geocode(post_data, function(err, response){
		    if (err) throw err;
		    fs.writeFile('./geocoding/'+Date.now()+'.json', JSON.stringify(response), function (err) { if (err) return console.log(err); });
			res.send('Response saved to '+ Date.now()+'.json');
		});
	});
}

exports.yelpBusinessCoding = function(req,res){
	var yelp = require("yelp").createClient({
	  consumer_key: "HMcwEHLw2Jq0_8-XyCdb7g", 
	  consumer_secret: "lC1ED2xYxb06NRGpkqNf4lt7cvw",
	  token: "PCsz8LpOyCr3Q7SPLYUpOg9O8znR2OzF",
	  token_secret: "AoTZWo9ry4aeHFGFlnXCoCfs-58"
	});

	var q = Inspections.aggregate([
		{ $match : { yelp_id: null } }, 
		{ $group: {"_id": {establishment_name: '$establishment_name',address: "$address",city: "$city_state_zip"}} },
		{ $limit: 1000 }
	]);
	
	q.exec(function (err,data){
		var csv_string = '';
		_.each(data,function(item){ 
			var loc = item._id.address + ',' + item._id.city;
			var t = item._id.establishment_name;
			yelp.search({term: t,location: loc, limit: 1, sort: 1}, function(error, yelpData) {
				if (yelpData != undefined){
					if (yelpData.businesses.length > 0) {
						var resp = yelpData.businesses[0].id;
						if (error) {console.log(error); }
						else { 
							csv_string= t + ',' + loc + ',' + resp + '\n'; 
							console.log(csv_string);
							fs.appendFile('./yelpcoding/yelp.csv', csv_string, function (err) { if (err) return console.log(err); });
						}
					}
				}
			});
		});	
	res.send('Response saved to yelp.csv');
	});
}