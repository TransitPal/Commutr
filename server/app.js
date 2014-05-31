var express = require('express');
var app = express();
var routers = {};
var helpers = require('./routeHelpers');

require('./config.js')(app, express, routers);

// Refactor complete
app.get('/', helpers.placeholder);

// Refactor complete
app.get('/api/v1/routes', helpers.getRoutes);

// Refactor complete
app.post('/api/v1/user', helpers.saveUser);

app.delete('/api/v1/user/:userId', helpers.deleteUser);

module.exports = app;
