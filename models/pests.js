var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;
 
var pestSchema = mongoose.Schema({
	establishment_name: String,
	address: String,
	city_state_zip: String,
	date_of_inspection: Date,
	observation : String
}, {collection: 'pests' });


module.exports = mongoose.model('Pest', pestSchema);