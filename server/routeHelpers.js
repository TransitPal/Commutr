var models = require('../db/models/user');
var db = require('../db/dbHelpers');
var User = require('../db/models/user').User;
var maps = require('./mapUtils');
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
  db.getUserLocations(req.query.email)
  .then(function(userLocations){
    if (!userLocations) {
      console.log('User not found');
      return res.send(400);
    }
    // returns promised directions object for userLocations
    maps.getDirections(userLocations.homeLocation, userLocations.workLocation)
    .then (function(route) {
      // getTransitTime returns total transit time for given route
      res.send(200, {time: maps.getTransitTime(route), route: route});
    })
    .catch(function(err) {
      res.send(500, err);
    });
  }, function(err) {
    res.send(500, err);
  });
};

// Saves new user and reponds with transit time
exports.saveUser = function(req, res){
  var settings = req.body;
  var email = settings.email;
  User.findOne({email:email}).exec()
    .then(function(user){
      if(user){
        // Update user
        for (var option in settings) {
          if(option === 'homeTime' || option === 'workTime'){
            user['routine'][option] = settings[option];
          } else {
            user[option] = settings[option];
          }
        }
      } else {
        // Create user
        // Correctly structures user object for database
        var user = new models.User({
          name: settings.name,
          email: settings.email,
          homeAddress: settings.homeAddress,
          // Seed data until Google APIs are set up
          homeLocation: {lat: 37.783542, lng: -122.408943},
          workAddress: settings.workAddress,
          // Seed data until Google APIs are set up
          workLocation: {lat: 37.7746071, lng: -122.4260718},
          routine: {
            workTime: settings.workTime,
            homeTime: settings.homeTime
          }
        });
      }
      // Save user
      user.save(function(err,user){
        if(err) {
          res.send(500,err);
          return console.error('Error:', err);
        }
        // Responds to client with transit time
        maps.getDirections(user.homeLocation, user.workLocation)
        .then(function(route) {
          res.send(201, {time: maps.getTransitTime(route)});
        })
        .catch(function(err){
          console.error('Error:',err);
        });
        console.log('User settings saved', user);
      });
    }, function(err){
      console.error(err);
      res.send(500,err);
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