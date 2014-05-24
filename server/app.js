var express = require('express');
var app = express();
var routers = {};
var helpers = require('./routeHelpers');

require('./config.js')(app, express, routers);

app.get('/', helpers.placeholder);

app.get('/api/v1/routes',helpers.getRoutes);


module.exports = app;