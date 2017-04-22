'use strict';

// load modules
var express = require('express'),
    app = express(),
    jsonParser = require('body-parser').json,
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    seeder = require('mongoose-seeder'),
    data = require('./data/data.json'),
    users = require('./routes/users'),
    courses = require('./routes/courses');

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));
app.use(jsonParser());

  //connect to mongo database
  mongoose.connect('mongodb://localhost/rest-api');

  var db = mongoose.connection;

  // database connection error handling
  db.on('error', function(err){
    console.error('connection error', err);
  });

  //log successful database connection
if (process.env.NODE_ENV !== 'test') {
  db.once('open', function(){
    console.log('db connection successful');
      seeder.seed(data, {dropDatabase: true}).then(function() {
        console.log('Database Seeded');
      }).catch(function(err) {
        console.log(err);
      });
  });
}


app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content-Type, Accept');
  if(req.method === "OPTIONS") {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
    return res.status(200).json({});
  }
  next();
});

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));
app.use('/api/users', users);
app.use('/api/courses', courses);

// catch 404 and forward to global error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if (err.message === 'User validation failed') {
    res.json(err.errors);
  } else {
    res.json({
      status: err.status,
      message: err.message
    });
  }
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});

module.exports = server;