var express = require('express'),
	mongoose = require('mongoose'),
	routes = require('./routes'),
	api = require('./routes/api.js'),
	http = require('http'),
	path = require('path'),
	app = module.exports = express();


mongoose.connect('mongodb://localhost/healthi'); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () { console.log('Database opened'); });



app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(app.router);
});

if (app.get('env') === 'development') { app.use(express.errorHandler()); }
if (app.get('env') === 'production') { };


app.get('/', routes.index);
app.get('/top20', api.top20);
app.get('/latest', api.latest);
app.get('/pests/:name', api.pests);
app.get('/partials/:name', routes.partials);
app.get('*', routes.index);

// redirect all others to the index (HTML5 history)
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});