'use strict';
   
var chai = require('chai'),
  expect = require('chai').expect,
chaiHttp = require('chai-http'),
mongoose = require('mongoose'),
  seeder = require('mongoose-seeder'),
    data = require('../src/data/data.json'),
  server = require('../src/index');

//Test suite

chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('database', function() {
  before(function(done) {
    //connect to mongo database
    mongoose.connect('mongodb://localhost/rest-api');
    var db = mongoose.connection;
    // database connection error handling
    db.on('error', function(err){
      console.error('connection error', err);
    });
    db.once('open', function(done){
      seeder.seed(data, {dropDatabase: true})
        .then(function() {
          console.log('Database Seeded');
        }).catch(function(err) {
          console.log(err);
        });
    });
    done();
  });
});

describe('/GET user', function() {
  it("it should return credentialed user's document", function(done){
    chai.request(server)
      .get('/api/users')
      .auth("joe@smith.com", "password")
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.emailAddress).to.equal("joe@smith.com");
        done();
      });
  });
});

describe('/GET course', function() {
  var id = '57029ed4795118be119cc43d';
  it('it should return 401 error with invalid credentials', function(done){
    chai.request(server)
      .get('/api/courses/' + id)
      .auth("joe@smith.com", " wrong password")
      .end(function(err, res){
        expect(res.status).to.equal(401);
        done();
      });
  });
});