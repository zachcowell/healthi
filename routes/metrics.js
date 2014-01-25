
var Inspections = require('../models/inspections.js');
var moment = require('moment');

var execQuery = function(q,res){
	q.exec(function (err, data) {
	  if (err) console.log(err);
	  res.send(data);
	});
}

exports.violation_breakdown = function(req, res) {
	var q = Inspections.aggregate([
			{ $match : { 
				date_of_inspection: { $gt: new Date(moment().subtract('days', 365).format()) }
			} 
			}, 
			{ $group: 
				{ 
					_id: null,
                	violations0 : { },
					violations1_3 : { },
					violations4_6 : { },
					violations7 : { },
                	number_of_reports: { $sum: 1 },
               		average_criticals : { $avg : "$critical_violations.total" },
               		average_noncriticals : { $avg : "$noncritical_violations.total" },
               		total_crit : { $sum : "$critical_violations.total" },
               		total_noncrit : { $sum : "$noncritical_violations.total" }
                } }
            ]);


var q = 
Inspections.aggregate(
{ $project: {
"critical_violations.total": 1,
establishment_name : 1
bucket: {
$cond: [
{$and: 
[{$gte: ["$critical_violations.total", 0]}, 
{ $lte: ["$critical_violations.total", 3]} ]},
'0-3', {
$cond: [ {$lt: ["$critical_violations.total", 4]},  '21-40',  {
$cond: [ {$lt: ["$critical_violations.total", 6]},  '41-60',  {
$cond: [ {$lt: ["$critical_violations.total", 81]},  '61-80',  {
$cond: [ {$lt: ["$critical_violations.total", 101]}, '81-100', '100+' ]
}]
}]
}]
}]
}
}},
{ $group: {
_id: "$bucket",
$sum: establishment_name
}});
	execQuery(q,res);
}