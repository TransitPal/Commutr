var models = require('../db/models/user');
var db = require('../db/dbHelpers');
var User = require('../db/models/user').User;
var maps = require('./mapUtils');
var utils = require('./utils.js');
var fs = require('fs');

exports.placeholder = function(req, res){
  res.send(200,'^_^');
};

exports.serveIndex = function(req, res){
  fs.readFile('./client/www/index.html', function(err, data){
    if (err) return err;
    res.set({'Content-Type': 'text/html'});
    res.send(200, data);
  });
};

exports.getRoutes = function(req, res) {
  // returns promised user homeLocation and workLocation based on input email
  db.getUser(req.query.email)
  .then(function(user){
    utils.getNextServerRequest(user, res);
  }, function(err) {
    res.send(500, err);
  });
};

// Saves new user and reponds with transit time
exports.saveUser = function(req, res){
  var settings = req.body;
  var email = settings.email;
  
  db.getUser(email)
  .then(function(user){
    if(user){
      // Update user
      for (var option in settings) {
        if(option === 'homeTime' || option === 'workTime'){
          user.routine[option] = settings[option];
        } else {
          user[option] = settings[option];
        }
      }
    } else {
      // Create user
      // Correctly structures user object for database
      user = new models.User({
        name: settings.name,
        email: settings.email,
        homeAddress: settings.homeAddress,
        workAddress: settings.workAddress,
        routine: {
          workTime: settings.workTime,
          homeTime: settings.homeTime
        }
      });
    }

    // TODO: Figure out better way of running something only after
    // two promises finish (determining the home and work locations)
    maps.getLatLong(user.homeAddress)
    .then(function(homeLocation) {
      maps.getLatLong(user.workAddress)
      .then (function(workLocation) {
        // Set user home and work locations
        user.homeLocation = homeLocation;
        user.workLocation = workLocation;
        
        // Save user
        user.save(function(err,user){
          if(err) {
            res.send(500,err);
            return console.error('Error:', err);
          }

          console.log(user);
          // Responds to client with time of next request
          utils.getNextServerRequest(user, res, 201);

          console.log('User settings saved', user);
        });

      }) // end getLatLong(workAddress)
      .catch(function(err) {
        console.error('ERROR:', err);
        res.send(500, err);
      });
    }) // end getLatLong(homeAddress)
    .catch(function(err) {
      console.error('ERROR:', err);
      res.send(500, err);
    });
  }, function(err) {
    console.error('ERROR:', err);
    res.send(500, err);
  });
};

// Deletes user from database and responds with 
exports.deleteUser = function(req, res){
  var email = req.params.userId;
  console.log('userId?',email);
  User.findOneAndRemove({email:email}, function(err, data){
    console.log('err', err);
    console.log('data',data);
    res.send(418, {err:err, data:data})
  })
}