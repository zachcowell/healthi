var Inspections = require('../models/inspections.js');

exports.top20 = function(req, res) {
	var q = Inspections.find({});
	//.sort({'noncritical_violations.total': -1})
	//.limit(20);
	q.exec(function (err, data) {
	  if (err) return handleError(err);
	  res.send(data);
	})
}

exports.pests = function(req, res) {
	var droppings = new RegExp('droppings', 'i');
	var roach = new RegExp('droppings', 'i');
	var mice = new RegExp('mice', 'i');

//	var q = Inspections.find({ 'observations.observation': { $regex: rat }});
	var q = Inspections.find().or(	
			//'observations.observation': { $regex: mice }
			[{'observations.observation' : {$regex: droppings}}, {'observations.observation': {$regex: mice}}] 
	);

	q.exec(function (err, data) {
	  if (err) return handleError(err);
	  res.send(data);
	})
}

exports.latest = function(req, res) {
	var q = Inspections.find({})
	.sort({'date_of_inspection': -1})
	.limit(20);
	q.exec(function (err, data) {
	  if (err) return handleError(err);
	  res.send(data);
	})
}

exports.name = function(req, res) {
	/*Inspections.find({ name_lower: req.params.name.toLowerCase() }, function (err, data) {
	  if (err) return handleError(err);
	  res.send(data);
	})*/
}