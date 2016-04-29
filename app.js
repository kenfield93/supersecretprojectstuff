/**
* Created by kyle on 4/10/16.
*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
// note: express-session says cookieParser might fuck up session if they don't share secret. Since I don't
// need cookies for this project beyond their use in sessions I just won't use it
//var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(session({
  secret: '1234567890QWERTY',
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

// IGNORE THIS. FROM CSE 112 PROJECT AND IS JUST HERE AS A REFERENCE
/*var newrelic = false;

 if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
 newrelic = require('newrelic');
 }

 var express = require('express');
 var session = require('express-session');
 var cookieParser = require('cookie-parser');
 var flash = require('connect-flash');
 var path = require('path');
 var logger = require('morgan');
 var bodyParser = require('body-parser');
 var multer = require('multer');
 var passport = require('passport');
 var async = require('async');
 var app = express();
 var request = require('request');

 app.io = require('socket.io')();

 global.__base = __dirname + '/';


 //Database
 var monk = require('monk');
 var mongoURI = process.env.MONGOLAB_URI || 'localhost:27017/robobetty';
 console.log('Connecting to DB: ' + mongoURI);
 var db = monk(mongoURI);

 //login config
 var businesses = db.get('businesses');
 var employee = db.get('employees');

 if (newrelic) {
 app.locals.newrelic = newrelic;
 }

 //passport functions to Serialize and Deserialize users

 passport.serializeUser(function (user, done) {
 done(null, user._id);
 });

 // used to deserialize the user
 passport.deserializeUser(function (id, done) {

 employee.find({_id: id}, function (err, user) {
 if (err) {
 done(err);
 }

 if (user) {
 done(null, user);
 }
 });
 });

 require('./config/passport')(passport); // pass passport for configuration


 var businessRoutes = require('./routes/webapp/business')(passport);

 // view engine setup
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'hjs');


 // uncomment after placing your favicon in /public
 //app.use(favicon(__dirname + '/public/favicon.ico'));
 app.use(logger('dev'));
 app.use(cookieParser());
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: false}));


 app.use(multer({
 dest: __dirname + '/public/images/uploads/',
 onFileUploadStart: function (file) {
 console.log(file.mimetype);
 if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
 return false;
 } else {
 console.log(file.fieldname + ' is starting ...');
 }
 },
 onFileUploadData: function (file, data) {
 console.log(data.length + ' of ' + file.fieldname + ' arrived');
 },
 onFileUploadComplete: function (file) {
 console.log(file.fieldname + ' uploaded to  ' + file.path);
 }
 }));


 app.use(express.static(path.join(__dirname, 'public')));
 app.use(express.static(path.join(__dirname, 'static')));


 //so... when only using router, for some reason deserialize wont work
 //but when using both or just app.use(session), the route works
 //note to j

 // required for passport
 app.use(session({secret: '1234567890QWERTY'}));
 app.use(flash());
 app.use(passport.initialize());
 app.use(passport.session()); // persistent login sessions

 // Make our db accessible to our router
 app.use(function (req, res, next) {
 req.db = db;
 req.passport = passport;
 req.app = app;
 next();
 });

 app.use(function (req, res, next) {
 res.header('Access-Control-Allow-Origin', 'fonts.googleapis.com');
 res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
 res.header('Access-Control-Allow-Headers', 'Content-Type');

 next();
 });


 // Set Webapp Routes
 app.use('/office', require('./routes/webapp/checkin'));
 app.use('/', businessRoutes);

 //app.use("/formBuilder", express.static(__dirname + '/formBuilder'));
 app.use('/api', require('./routes/webapi'));

 // catch 404 and forward to error handler
 app.use(function (req, res, next) {
 var err = new Error("Couldn't find All the things");
 err.status = 404;
 res.render('error', {message: err.message, error: err});
 //next(err);
 });

 // error handlers

 // development error handler
 // will print stacktrace
 if (app.get('env') === 'development') {
 app.use(function (err, req, res) {
 console.error(err);
 console.error(err.stack);
 res.status(err.status || 500);
 res.render('error', {
 message: err.message,
 error: "Uh oh spaghettios"
 });
 });
 }

 // production error handler
 // no stacktraces leaked to user
 app.use(function (err, req, res) {
 res.status(err.status || 500);
 console.error(err);
 console.error(err.stack);
 res.render('error', {
 message: err.message,
 error: {}
 });
 });


 exports = module.exports = app;
*/