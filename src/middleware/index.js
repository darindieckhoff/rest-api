'use strict';

var User = require('../models').User;
var auth = require('basic-auth');

function authorization(req, res, next){
  var credentials = auth(req);
  if (!credentials) {
    var err = new Error('Email or password not provided.');
    err.status = 401;
    return next(err);
  } else {
    User.authenticate(credentials.name, credentials.pass, function (err, user){
      if (err || !user) {
        var err = new Error('Incorrect email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.data = user;
        return next();
      }
    });
  }
}

module.exports.authorization = authorization;