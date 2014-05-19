var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;
 
var inspectionSchema = mongoose.Schema({
	response_url: String,
	establishment_name: String,
	address: String,
	city_state_zip: String,
	telephone: String,
	date_of_inspection: Date,
	license_holder: String,
	establishment_type: String,
	risk_category: Number,
	loc: {
		lon: Number,
		lat: Number
	},
	type_of_inspection: String,
	license_customer_number: String,
	time_in: String,
	time_out: String,
	email_address: String,
	name_of_licensed_trash_or_solid_waste_contractor: String,
	name_of_licensed_liquid_grease_collections_transport_contractor: String,
	name_of_licensed_pest_exterminator_contractor: String,
	cfpm_number: String,
	cfpm_expiration_date: Date,
	certified_food_protection_manager: String,
	license_period_start: Date,
	license_period_end: Date,
	noncritical_violations: {
		total: Number,
		cos: Number,
		r: Number
	},
	critical_violations: {
		total: Number,
		cos: Number,
		r: Number
	},
	compliance_line_items: {
		line_number : String,
		compliance_status : String,
		line_item : String,
		cos : Number,
		r : Number
	},
	observations: {
		observation : String,
		dcmr: String,
		corrective_actions: String
	}
}, {collection: 'inspections' });


module.exports = mongoose.model('Inspection', inspectionSchema);