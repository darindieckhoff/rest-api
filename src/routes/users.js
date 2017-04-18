'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models').User;
var mid = require('../middleware');

//GET users
router.get('/', mid.authorization, function(req, res, next){
  res.json(req.data);
});

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