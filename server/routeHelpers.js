var models = require('../db/models/user');
var db = require('../db/dbHelpers');
var maps = require('./mapUtils');
var fs = require('fs');

exports.placeholder = function(req, res){
  fs.readFile('./client/www/index.html', function(err, data){
    if (err) return err;
    res.set({'Content-Type': 'text/html'});
    res.send(200, data);
  });
};

exports.saveUser = function(settings, res){
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

  maps.getDirections(user.homeLocation, user.workLocation)
  .then(function(route) {
    res.send(201, {time: maps.getTransitTime(route)});
  })
  .catch(function(err){
    console.error('ERROR!!!!!!!!',err);
  });

  user.save(function(err,user){
    if(err) return console.log('++++++++++++++++++++++', err);
    console.log('User settings saved', user);
  });


};

exports.getRoutes = function(req, res) {
  db.getUserLocations(req.query.email)
  .then(function(userLocations){
    if (!userLocations) { 
      console.log('User not found');
      res.send(400); 
    }
    maps.getDirections(userLocations.homeLocation, userLocations.workLocation)
    .then (function(route) {
      res.send(200, {time: maps.getTransitTime(route), route: route});
    })
    .catch(function(err) {
      res.send(500, err);
    });
  }, function(err) {
    res.send(500, err);
  });
};
