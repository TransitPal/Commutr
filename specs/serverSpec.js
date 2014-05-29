var express = require('express');
var request = require('supertest');
var expect = require('chai').expect;
var url = require('url');
var User = require('../db/models/user.js').User;

var app = require('../server/app');

describe('Server', function(){

  var user = {
    query:{
      name: 'Nick',
      email: 'nicksemail@gmail.com',
      homeAddress: 'San Francisco',
      workAddress: '944 Market St, San Francisco',
      workTime: 9,
      homeTime: 2
    }
  };
  user = url.format(user);

  it('should return a 200 status on get request to /', function(done){
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });

  it('should return a 201 status on a post request to /api/v1/user', function(done){
    request(app)
      .post('/api/v1/user?' + user)
      .expect(201)
      .end(function(){
        User.findOneAndRemove({email: "nicksemail@gmail.com"}).exec()
          .then(function(){ done(); });
      });
  });

  it('should return a 200 status and route object on a get request to /api/v1/routes', function(done){
    request(app)
      .post('/api/v1/user?' + user);
    request(app)
      .get('/api/v1/routes?email=nicksemail@gmail.com')
      .expect(200)
      .expect(function(res){
        expect(res).to.be.an('object');
      })
      .end(function(){
        User.findOneAndRemove({email: "nicksemail@gmail.com"}).exec()
          .then(function(){ done(); });
      });
  });

  it('should return a directions object on a get request to /api/v1/routes with an email parameter specified', function(done){
    request(app)
      .post('/api/v1/user?' + user);
    request(app)
      .get('/api/v1/routes?email=nicksemail@gmail.com')
      .expect(function(res) {
        expect(JSON.parse(res.text)).to.have.property('routes')
      })
      .expect(function(res){
        expect(JSON.parse(res.text)).to.have.property('status')
      })
      .end(function(){
        User.findOneAndRemove({email: "nicksemail@gmail.com"}).exec()
          .then(function(){ done(); });
      });
  });
});
