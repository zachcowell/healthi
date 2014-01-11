var Inspections = require('../models/inspections.js');

exports.list = function(req, res) {
	Inspections.find({}, function (err, data) {
	  if (err) return handleError(err);
	  res.send(data);
	})
}