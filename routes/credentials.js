
var credentialKeys = {
	'development' : 'mongodb://localhost/healthi',
	'production' : 'mongodb://rootu:bravo@ds027749.mongolab.com:27749/healthi'
};

exports.getKey = function(key){ return credentialKeys[key]; }