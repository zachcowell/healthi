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

exports.insertion = function(req,res){
	var pwd = fs.readdirSync('./geocoding/');
	
	_.each(pwd,function(item){ 
		if (item.substr(-4) == 'json' && item != 'package.json') {
			var response = JSON.parse(fs.readFileSync('./geocoding/'+item,'utf8')); 
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
	res.send('Updates complete');
}