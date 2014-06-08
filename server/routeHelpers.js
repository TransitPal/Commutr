var db = require('../db/dbHelpers'),
    User = require('../db/models/user').User,
    maps = require('./mapUtils'),
    utils = require('./utils.js'),
    fs = require('fs');

var placeholder = function(req, res){
  res.send(200,'^_^');
};

var serveIndex = function(req, res){
  fs.readFile('./client/www/index.html', function(err, data){
    if (err) {
      console.error(err);
      return res.send(500, err);
    }
    res.set({'Content-Type': 'text/html'});
    res.send(200, data);
  });
};

// Returns routing object with origin, destination, and arrival time
// Based on user's routine and current time of day
var getRoutes = function(req, res) {
  if (!req.query.email) {
    return res.send(400);
  }

  db.getUser(req.query.email)
  .then(function(user){
    res.send(200, utils.getNextRoute(user));
  }, function(err) {
    console.error('ERROR:', err);
    res.send(500, err);
  });
};

// Saves new user and reponds with next route
var saveUser = function(req, res){
  if (!req.body.user) {
    return res.send(400);
  }

  var settings = req.body.user;
  console.log(settings);
  var email = settings.email;
  
  db.getUser(email)
  .then(function(user){
    if(user){
      // Update user
      for (var option in settings) {
        if(option === 'homeTime' || option === 'workTime'){

          user.routine[option] = utils.convertTimeStringToObject(settings[option]);
        } else {
          user[option] = settings[option];
        }
      }
    } else {
      // Create user
      // Correctly structures user object for database
      user = new User({
        name: settings.name,
        email: settings.email,
        homeAddress: settings.homeAddress,
        workAddress: settings.workAddress,
        routine: {
          workTime: utils.convertTimeStringToObject(settings.workTime),
          homeTime: utils.convertTimeStringToObject(settings.homeTime)
        },
        locations: []
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
            return console.error('ERROR:', err);
          }

          // Responds to client with routing object
          res.send(201, utils.getNextRoute(user));
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

var saveLocation = function(req, res) {
  if (!req.params.userId) {
    return res.send(400);
  }
  var userId = req.params.userId;
  
  db.getUser(req.params.userId)
  .then(function(user) {
    var locationData = req.body;
    var locationObj = {
      time: new Date(locationData.location.recorded_at).getTime(),
      location: {
        lat: locationData.location.latitude,
        lng: locationData.location.longitude
      }
    };
    user.locations.push(locationObj);
    user.save(function(err, user) {
      if (err) { 
        res.send(500, err);
        return console.err('ERROR:', err);
      } else {
        res.send(200, userId);
      }
    });
  });
};

// Deletes user from database
var deleteUser = function(req, res){
  if (!req.params.userId) {
    return res.send(400);
  }
  var email = req.params.userId;
  User.findOneAndRemove({email:email}, function(err, data){
    if(err) {
      console.error(err);
      return res.send(500);
    }
    res.send(418, {err:err, data:data});
  });
};

module.exports = {
  placeholder: placeholder,
  serveIndex: serveIndex,
  getRoutes: getRoutes,
  saveUser: saveUser,
  saveLocation: saveLocation,
  deleteUser: deleteUser
};
