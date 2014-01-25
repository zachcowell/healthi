var add_list = db.inspections.aggregate([{ $group: {"_id": {address: "$address",city: "$city_state_zip"}}}]).result;
var i = 0;
for (x in add_list) { 
	if (i < 3)
	{
		var ca = add_list[x]._id.address + ', ' + add_list[x]._id.city; 
		print(ca); 
	}
	i++;
}
