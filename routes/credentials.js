
var credentialKeys = {
	'development' : 'mongodb://localhost/healthi',
<<<<<<< HEAD
	'production' : 'some-credentials-here'
=======
	'production' : 'mongodb://rootu:bravo@ds027749.mongolab.com:27749/healthi'
>>>>>>> prod
};

exports.getKey = function(key){ return credentialKeys[key]; }