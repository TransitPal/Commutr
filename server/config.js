var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var middle = require('./middleware');

module.exports = exports = function(app, express, routers){
  app.set('port', process.env.PORT || 8080);
  app.set('base url', process.env.URL || 'http://localhost');
  app.use(bodyParser());
  app.use(middle.cors);
  app.use(middle.logError);
  app.use(middle.handleError);
};