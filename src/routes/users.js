'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models').User;
var mid = require('../middleware');

//GET currently authorized user
router.get('/', mid.authorization, function(req, res, next){
  res.json(req.data);
});

//POST add new user to db
router.post('/', function (req, res, next){
  var user = new User(req.body);
  user.save(function(err, user){
    if (err) return next(err);
    res.status(201);
    res.location('/');
    res.end();
  });
});

module.exports = router;