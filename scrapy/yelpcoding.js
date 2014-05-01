var keys = db.yelptemp.find();
keys.forEach(function(doc){
    var addr = doc.address;
	//var csz = doc.city + ' ' + doc.state_zip;
	var id = doc.yelp_id;
	var name = doc.establishment_name;

	db.inspections.update(
		{	address: addr, 
			establishment_name: name
		},
		{$set: {yelp_id: id}}, 
		{ upsert: false,multi: true });
});