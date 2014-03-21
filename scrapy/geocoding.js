var keys = db.geotemp.find();
keys.forEach(function(doc){
    var query = doc.query.split(",");
	if (query.length == 3){
		var csz = (query[1] +','+ query[2]).trim();
		var addr = query[0];
	}
	else {
		var csz = (query[2] +','+ query[3]).trim();
		var addr = query[0] +','+ query[1];
	}	
	if (doc.response.results != undefined) {
		if (doc.response.results.length > 0){ 
			var lati = parseFloat(doc.response.results[0].location.lat);
			var longi = parseFloat(doc.response.results[0].location.lng);
			db.inspections.update(
        		{address: addr, city_state_zip: csz},
				{$set: {lat: lati, lng: longi}}, 
				{ upsert: false,multi: true });
		}
	}
});