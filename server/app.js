var express = require('express');
var app = express();
var routers = {};
var helpers = require('./routeHelpers');

require('./config.js')(app, express, routers);

app.get('/', helpers.placeholder);
app.get('/api/v1/routes', helpers.getRoutes);

app.post('/api/v1/user', function(req, res){
  console.log('executing /user');
  helpers.saveUser(req.query, res);
});

module.exports = app;
