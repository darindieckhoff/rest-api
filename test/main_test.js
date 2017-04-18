'use strict';
var mongoose = require('mongoose');    
var seeder = require('mongoose-seeder');
var data = require('../src/data/data.json');
var Models = require('../src/models');
var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var server = require('../src/index');

//Test suite

chai.use(chaiHttp);

describe('/GET user', function() {
  it("it should return credentialed user's document", function(done){
    chai.request(server)
      .get('/api/users')
      .auth("joe@smith.com", "password")
      .end(function(err, res){
        expect(res.status).to.equal(401);
        done();
      });
  });
});

describe('/GET course', function() {
  var id = '57029ed4795118be119cc43d';
   
  it('it should return 401 error with invalid credentials', function(done){
    chai.request(server)
      .get('/api/courses/' + id)
      //.auth("joe@smith.com", "password")
      .end(function(err, res){
        expect(res.status).to.equal(401);
        done();
      });
  });
});