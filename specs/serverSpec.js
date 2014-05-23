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
});