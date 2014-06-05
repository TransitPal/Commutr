var express = require('express');
var app = express();
var routers = {};
var helpers = require('./routeHelpers');

require('./config.js')(app, express, routers);

// Website
app.get('/', helpers.placeholder);

// Directions
app.get('/api/v1/routes', helpers.getRoutes);

// Users
app.post('/api/v1/user', helpers.saveUser);
app.post('/api/v1/user/:userId/location', helpers.saveLocation);
app.delete('/api/v1/user/:userId', helpers.deleteUser);

module.exports = app;
