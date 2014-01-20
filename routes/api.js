var Inspections = require('../models/inspections.js');
var _ = require('underscore');
var moment = require('moment');

/* API Helpers */
var getOrObject = function (keywords){
	var arr = new Array();
	_.each(keywords, function(item) { arr.push({'observations.observation' : new RegExp(item,'i')}) } )
	return arr;
}

var execQuery = function(q,res){
	q.exec(function (err, data) {
	  if (err) console.log(err);
	  res.send(data);
	});
}

exports.search = function(req, res) {
	if (undefined != req.body.establishment_name){
		var q = Inspections.aggregate([
			{ $match : { establishment_name: new RegExp(req.body.establishment_name,'i') } }, 
			{ $group: 
				{ 
					_id: { 
						establishment_name: "$establishment_name",
	                    address: "$address",
	                    city_state_zip : "$city_state_zip"
                	},
                	number_of_reports: { $sum: 1 },
               		average_criticals : { $avg : "$critical_violations.total" },
               		average_noncriticals : { $avg : "$noncritical_violations.total" },
               		total_crit_r : { $sum : "$critical_violations.r" },
               		total_noncrit_r : { $sum : "$noncritical_violations.r" },
               		recent_inspection : { $last : "$date_of_inspection" }
                } }
            ]);
	}
	execQuery(q,res);
}

exports.worstRestaurantsAvg = function(req,res){
	var q = Inspections.aggregate([
		{ $match : { date_of_inspection: { $gt: new Date(moment().subtract('days', 365).format()) } } }, 
		{ $group: 
			{ 
				_id: { 
					establishment_name: "$establishment_name",
	                address: "$address",
	                city_state_zip : "$city_state_zip"
	        	},
	        	number_of_reports: { $sum: 1 },
	       		average_criticals : { $avg : "$critical_violations.total" },
	       		average_noncriticals : { $avg : "$noncritical_violations.total" },
	       		total_crit_r : { $sum : "$critical_violations.r" },
	       		total_noncrit_r : { $sum : "$noncritical_violations.r" },
	       		recent_inspection : { $last : "$date_of_inspection" }
	        } },
	    { $sort: { average_criticals: -1 } }
	]).limit(10);
	execQuery(q,res);
}

exports.worstRecentInspections = function(req,res){
	var returned_fields = {
		response_url : 1,
		establishment_name: 1,
		address : 1,
		city_state_zip : 1,
		"critical_violations.total" : 1,
		"noncritical_violations.total" : 1,
		date_of_inspection: 1
	};
	var q = Inspections.find({
		date_of_inspection: { 
			$gt: new Date(moment().subtract('days', 30).format()) } 
	},returned_fields)
	.sort({'critical_violations.total': -1})
	.limit(20);
	execQuery(q,res);
}

exports.worstInspections = function(req,res){
	var returned_fields = {
		response_url : 1,
		establishment_name: 1,
		address : 1,
		city_state_zip : 1,
		"critical_violations.total" : 1,
		"critical_violations.r" : 1,
		"critical_violations.cos" : 1,
		"noncritical_violations.total" : 1,
		"noncritical_violations.r" : 1,
		"noncritical_violations.cos" : 1,
		date_of_inspection: 1
	};
	var q = Inspections.find({},returned_fields)
	.sort({'critical_violations.total': -1})
	.limit(20);
	execQuery(q,res);
}


exports.worstRepeats = function(req,res){
	var returned_fields = {
		response_url : 1,
		establishment_name: 1,
		address : 1,
		city_state_zip : 1,
		"critical_violations.total" : 1,
		"critical_violations.r" : 1,
		"critical_violations.cos" : 1,
		"noncritical_violations.total" : 1,
		"noncritical_violations.r" : 1,
		"noncritical_violations.cos" : 1,
		date_of_inspection: 1
	};
	var q = Inspections.find({},returned_fields)
	.sort({'critical_violations.r': -1})
	.limit(20);
	execQuery(q,res);
}


exports.keywordSearch = function(req, res) {
	var returned_fields = {
		response_url : 1,
		establishment_name: 1,
		address: 1,
		city_state_zip: 1,
		date_of_inspection: 1,
		type_of_inspection: 1,
		noncritical_violations: 1,
		critical_violations: 1,
	};
	
	var q = Inspections.find({},returned_fields).limit(200);
	if (req.body.keywords.length > 0) q = q.or(getOrObject(req.body.keywords));
	execQuery(q,res);
}

exports.latest = function(req, res) {
	var returned_fields = {
		response_url : 1,
		establishment_name: 1,
		address : 1,
		date_of_inspection: 1
	};
	var q = Inspections.find({},returned_fields).sort({'date_of_inspection': -1}).limit(10);
	execQuery(q,res);
}

exports.restaurantNames = function(req, res) {
	if (undefined != req.body.establishment_name) var q = Inspections.distinct("establishment_name", {establishment_name: new RegExp(req.body.establishment_name,'i') })
	else var q = Inspections.aggregate([{$group: {"_id": {establishment_name: "$establishment_name",address: "$address" } } } ] );
	execQuery(q,res);
}

exports.name = function(req, res) {
		var returned_fields = {
		response_url : 1,
		establishment_name: 1,
		address: 1,
		city_state_zip: 1,
		date_of_inspection: 1,
		type_of_inspection: 1,
		noncritical_violations: 1,
		critical_violations: 1
	};
	if (undefined != req.body.establishment_name) 
		var q = Inspections.find({ establishment_name : req.body.establishment_name, address : req.body.address },returned_fields).limit(200);
	else var q = Inspections.aggregate([{$group: {"_id": {establishment_name: "$establishment_name",address: "$address" } } } ] );
	execQuery(q,res);
}