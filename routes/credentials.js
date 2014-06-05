
var credentialKeys = {
	'development' : 'mongodb://localhost/healthi',
	'production' : 'some-credentials-here'

};

exports.getKey = function(key){ return credentialKeys[key]; }