var express = require('express');
var app = express();
var routers = {};
var helpers = require('./routeHelpers');

require('./config.js')(app, express, routers);

app.get('/', helpers.placeholder);

module.exports = app;