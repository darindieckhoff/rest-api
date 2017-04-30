'use strict';
   
process.env.NODE_ENV = 'test';

var chai = require('chai'),
  expect = require('chai').expect,
chaiHttp = require('chai-http'),
mongoose = require('mongoose'),
  seeder = require('mongoose-seeder'),
    data = require('../src/data/data.json'),
  server = require('../src/index');

//Test suite

chai.use(chaiHttp);

describe('/GET', function() {
  before(function(done) {
    mongoose.connection.once('open', function(){
      console.log('db connection successful');
      seeder.seed(data, {dropDatabase: true})
      .then(function() {
        console.log('Database Seeded');
        done();  
      }).catch(function(err) {
        console.log(err);
      });
    });
  });
  it("it should return credentialed user's document", function(done){
    chai.request(server)
      .get('/api/users')
      .auth("joe@smith.com", "password")
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.body.emailAddress).to.equal("joe@smith.com");
        done();
      });
  });
  it('it should return 401 error with invalid credentials', function(done){
    var id = '57029ed4795118be119cc43d';
    chai.request(server)
      .get('/api/courses/' + id)
      .auth("joe@smith.com", " wrong password")
      .end(function(err, res){
        expect(res.status).to.equal(401);
        done();
      });
  });
});
