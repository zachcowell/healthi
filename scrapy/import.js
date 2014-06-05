db.inspections.remove({establishment_name: ""});
db.inspections.remove({establishment_name: null});


//db.inspections.update({},{$set: {loc: {lon: null,lat:null}}} ,{multi:true});
db.inspections.update({},{$set: {yelp_id: null}},{multi:true});
var pestObservations = [];

db.inspections.find({}).forEach( function (x) {   
 	if (typeof x.critical_violations != 'undefined' ){
	 	x.critical_violations.total = parseInt(x.critical_violations.total); 
	 	x.critical_violations.cos = parseInt(x.critical_violations.cos); 
	 	x.critical_violations.r = parseInt(x.critical_violations.r); 
	 	if (isNaN(x.critical_violations.total)) x.critical_violations.total = 0;
		if (isNaN(x.critical_violations.cos)) x.critical_violations.cos = 0;
		if (isNaN(x.critical_violations.r)) x.critical_violations.r = 0;
	}
	if (typeof x.noncritical_violations != 'undefined'){
		x.noncritical_violations.total = parseInt(x.noncritical_violations.total); 
		x.noncritical_violations.cos = parseInt(x.noncritical_violations.cos); 
		x.noncritical_violations.r = parseInt(x.noncritical_violations.r); 
		if (isNaN(x.noncritical_violations.total)) x.noncritical_violations.total = 0;
		if (isNaN(x.noncritical_violations.cos)) x.noncritical_violations.cos = 0;
		if (isNaN(x.noncritical_violations.r)) x.noncritical_violations.r = 0;

	}
	if (typeof x.compliance_line_items != 'undefined'){
		x.compliance_line_items.cos = parseInt(x.compliance_line_items.cos); 
		x.compliance_line_items.r = parseInt(x.compliance_line_items.r); 
		if (isNaN(x.compliance_line_items.cos)) x.compliance_line_items.cos = 0;
		if (isNaN(x.compliance_line_items.r)) x.compliance_line_items.r = 0;
	}
	
	x.risk_category = parseInt(x.risk_category);
	if (isNaN(x.risk_category)) x.risk_category = -1;
	
	if (typeof x.loc != 'undefined'){
		x.loc.lat = parseFloat(x.loc.lat);
		x.loc.lon = parseFloat(x.loc.lon);
	}

	/* Clean up for proper linking */
	if (x.establishment_name.indexOf("/") > -1){ x.establishment_name= x.establishment_name.replace(/\//g,' '); }
	if (x.address.indexOf("/") > -1){ x.address= x.address.replace(/\//g,' '); }
	if (x.city_state_zip.indexOf("/") > -1){ x.city_state_zip= x.city_state_zip.replace(/\//g,' '); }
	if (x.establishment_name.indexOf("#") > -1){ x.establishment_name= x.establishment_name.replace(/#/g,' '); }
	if (x.address.indexOf("#") > -1){ x.address= x.address.replace(/#/g,' '); }
	if (x.city_state_zip.indexOf("#") > -1){ x.city_state_zip= x.city_state_zip.replace(/#/g,' '); }

	/* Populate Pest table for quick access */
	x.observations.forEach(function(obs){  
		['dropping','roach','mice','rodent','feces','mouse','flies','gnats'].forEach(function(keyword){ 
			if (obs.observation.indexOf(keyword) > -1 ) { 
				pestObservations.push({
					establishment_name: x.establishment_name,
					observation: obs.observation,
					address: x.address,
					city_state_zip: x.city_state_zip,
					date_of_inspection: x.date_of_inspection
				});
			}
		})
	})

  	x.date_of_inspection = new Date(x.date_of_inspection);
  	x.cfpm_expiration_date = new Date(x.cfpm_expiration_date);
  	x.license_period_start = new Date(x.license_period_start);
  	x.license_period_end = new Date(x.license_period_end);
  	db.inspections.save(x);
});

db.pests.insert(pestObservations);