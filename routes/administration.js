var Inspections = require('../models/inspections.js');
var _ = require('underscore');
var fs = require('fs');

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