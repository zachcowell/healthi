db.inspections.remove({establishment_name: ""})
db.inspections.find({}).forEach( function (x) {   
 	x.critical_violations.total = parseInt(x.critical_violations.total); 
 	x.critical_violations.cos = parseInt(x.critical_violations.cos); 
 	x.critical_violations.r = parseInt(x.critical_violations.r); 
	x.noncritical_violations.total = parseInt(x.noncritical_violations.total); 
	x.noncritical_violations.cos = parseInt(x.noncritical_violations.cos); 
	x.noncritical_violations.r = parseInt(x.noncritical_violations.r); 
	x.compliance_line_items.cos = parseInt(x.compliance_line_items.cos); 
	x.compliance_line_items.r = parseInt(x.compliance_line_items.r); 
	x.risk_category = parseInt(x.risk_category);
  	x.date_of_inspection = new Date(x.date_of_inspection);
  	x.cfpm_expiration_date = new Date(x.cfpm_expiration_date);
  	x.license_period_start = new Date(x.license_period_start);
  	x.license_period_end = new Date(x.license_period_end);
  	db.inspections.save(x);
});