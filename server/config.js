var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var middle = require('./middleware');
var cors = require('cors');

var mongoURI = process.env.DB_URI || 'mongodb://localhost/commutrDev';
mongoose.connect(mongoURI);

module.exports = exports = function(app, express, routers){
  app.set('port', process.env.PORT || 8080);
  app.set('base url', process.env.URL || 'http://localhost');
  app.use(bodyParser());
  app.use(cors());
  app.use(middle.logError);
  app.use(middle.handleError);
};
