'use strict';

var express = require('express');
var router = express.Router();
var Course = require('../models').Course;
var User = require('../models').User;
var Review = require('../models').Review;
var mid = require('../middleware');

//GET all courses
router.get('/', mid.authorization, function(req, res, next){
  Course.find({user: req.data._id})
    .select('title')
    .exec(function(err, course){
      if (err) return next(err);
      if (!course) {
        err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }
      res.json(course);
    });
});

//get specific course
router.get('/:courseId', mid.authorization, function(req, res, next){
  Course.findOne({user: req.data._id})
    .populate('user', 'fullName')
    .populate({
      path: 'reviews',
      populate: {path: 'user', select: 'fullName'}
    })
    .exec(function(err, course){
      if (err) return next(err);
      if (!course) {
        err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }
      res.json(course);
    });
});

router.post('/', function (req, res, next){
  var course = new Course(req.body);
  course.save(function(err, user){
    //console.log(err);
    if (err) return next(err);
    res.status(201);
    res.location('/');
    res.end();
  });
});

router.put('/:courseId', mid.authorization, function (req, res, next){
  var id = req.params.courseId,
    body = req.body;
  Course.findByIdAndUpdate(id, body, function (err, course){
    if (err) return next(err);
      if (!course) {
        err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }
    res.status(204);
    res.end();
  });
});

router.post('/:courseId/reviews', mid.authorization, function (req, res, next){
  Course.findOne({ _id: req.params.courseId})
    .populate('user')
    .exec(function(err, course){
      var courseUser = course.user._id.toString();
      var authUser = req.data._id.toString();
      if (err) {
        return next(err);
      } 
      if (courseUser === authUser) {
        err = new Error('User cannot review their own course.');
        err.status = 401;
        return next(err);
      } else {
        var doc = {
        user: course.user._id,
        rating: req.body.rating
        }

        var review = new Review(doc);

        course.reviews.push(review);

        review.save(function(err){
          if (err) return next(err);
        });

        course.save(function(err){
          if (err) return next(err);
        });

        res.status(201);
        res.location('/' + req.params.courseId);
        res.end();
      }
  });
});

module.exports = router;