var express = require('express');
var request = require('supertest');
var expect = require('chai').expect;

var app = require('../server/app');

describe('Server', function(){
  it('should return a 200 status on get request to /',function(done){
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });

  it('should return a 200 status and route array on a get request to /api/v1/routes',function(done){
    request(app)
      .get('/api/v1/routes')
      .expect(200)
      .expect(function(res){
        expect(res.body).to.be.an('array');
      })
      .end(done);
  })

  it('should return a 201 status on a post request to /api/v1/user',function(done){
    request(app)
      .post('/api/v1/user')
      .expect(201)
      .end(done);
  })
});
