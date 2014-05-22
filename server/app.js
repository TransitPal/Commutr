var express = require('express');
var app = express();
var routers = {};

require('./config.js')(app, express, routers);

app.get('/', function(req, res){
  res.send(200, 'Hello, world! ^_^');
});

module.exports = app;