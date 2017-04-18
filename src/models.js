'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

//validate email
var validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

var UserSchema = new Schema({
  fullName: {type: String, required: [true, 'Name is required.']},
  emailAddress: {
    type: String, 
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required.",
    validate: [validateEmail, 'Email address not valid.'],
  },
  password: {type: String, required: [true, 'Password is required.']}
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({emailAddress: email})
    .exec(function(err, user){
      if (err) {
        return calback(err);
      } else if (!user) {
        err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result){
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      });
    });
}

UserSchema.pre('save', function(next){
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash){
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

var CourseSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},  
  title: {type: String, required: [true, 'Title is required.']},
  description: {type: String, required: [true, 'Description is required.']},
  estimatedTime: String,
  materialsNeeded: String,
  steps: [
    {
      stepNumber: Number,
      title: {type: String, required: [true, 'Title is required.']},
      description: {type: String, required: [true, 'Description is required.']}
    }
  ],
  reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
    //Array of ObjectId values from reviews collection
});

var ReviewSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  postedOn: {type: Date, default: Date.now()},
  rating: {type: Number, 
    required: [true, 'Rating is required.'], 
    min: [1, 'Must give at least 1 star rating.'], 
    max: [5, 'Cannot give more than 5 star rating.']},
  review: String
});

var User = mongoose.model('User', UserSchema);
var Course = mongoose.model('Course', CourseSchema);
var Review = mongoose.model('Review', ReviewSchema);

module.exports.User = User;
module.exports.Course = Course;
module.exports.Review = Review;