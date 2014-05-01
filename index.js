var express = require('express'),
	mongoose = require('mongoose'),
	routes = require('./routes'),
	api = require('./routes/api.js'),
	metrics = require('./routes/metrics.js'),
	admin = require('./routes/administration.js'),
	http = require('http'),
	path = require('path'),
	app = module.exports = express();


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.configure(function(){
	app.set('env','production');
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(allowCrossDomain);
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(app.router);
});

if (app.get('env') === 'development') { 
	app.use(express.errorHandler()); 
	mongoose.connect('mongodb://localhost/healthi'); 
}
if (app.get('env') === 'production') { 
	mongoose.connect('mongodb://rootu:bravo@ds027749.mongolab.com:27749/healthi'); 
};

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () { console.log('Database opened'); });


app.get('/', routes.index);

app.post('/keywordSearch', api.keywordSearch);
app.post('/find', api.search);
app.get('/timeseries/violation',api.violationTimeseries);
app.get('/latest', api.latest);
app.get('/worst/restaurantsavg', api.worstRestaurantsAvg);
app.get('/worst/recentinspection', api.worstRecentInspections);
app.get('/worst/inspections', api.worstInspections);
app.get('/worst/repeatcriticals', api.worstRepeats);
app.get('/latlng',admin.geocoding);
app.get('/yelpcode',admin.yelpBusinessCoding);
app.post('/name', api.name);
app.post('/restaurantNames', api.restaurantNames);
app.get('/partials/:name', routes.partials);

app.get('/metrics/incidentBreakdown',metrics.violation_breakdown)

app.get('*', routes.index);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});