var Inspections = require('../models/inspections.js');
var _ = require('underscore');

exports.top20 = function(req, res) {
	var q = Inspections.find({})
	//.sort({'noncritical_violations.total': -1})
	.limit(20);
	q.exec(function (err, data) {
	  if (err) return handleError(err);
	  res.send(data);
	})
}

var getOrObject = function (keywords){
	var arr = new Array();
	_.each(keywords, function(item) { arr.push({'observations.observation' : new RegExp(item,'i')}) } )
	return arr;
}

exports.pests = function(req, res) {
	var keywords = ['droppings','roach','mice','rodent','feces']
	var returned_fields = {
		response_url : 1,
		establishment_name: 1,
		address: 1,
		city_state_zip: 1,
		date_of_inspection: 1,
		risk_category: 1,
		type_of_inspection: 1,
		noncritical_violations: 1,
		critical_violations: 1,
		observations : 1
	};

	var getName = function(request){
		if (request.params.name == undefined) return;
		else return [{ 'establishment_name' : new RegExp(request.params.name,'i') }];
	}

	var q = Inspections.find({},returned_fields)
			.or(getOrObject(keywords))
			.and(getName(req));

	q.exec(function (err, data) {
	  if (err) return handleError(err);
	  console.log(data.length);
	  res.send(data);
	})
}

exports.browsePests = function(req, res) {
	var keywords = ['dropping','roach','mice','rodent','feces','mouse']
	var returned_fields = {
		response_url : 1,
		establishment_name: 1,
		address: 1,
		city_state_zip: 1,
		date_of_inspection: 1,
		risk_category: 1,
		type_of_inspection: 1,
		noncritical_violations: 1,
		critical_violations: 1,
		observations : 1
	};

	var q = Inspections.find({},returned_fields)
		.or(getOrObject(keywords))
		.sort({'date_of_inspection': -1});
		//.limit(20);

	q.exec(function (err, data) {
	  if (err) return handleError(err);
	  //console.log(data.length);
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