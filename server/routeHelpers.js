var models = require('../db/models/user');
var maps = require('./mapUtils');

exports.placeholder = function(req, res){
  res.send(200, 'Hello, world! ^_^');
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

  maps.getTransitTime(user.homeLocation, user.workLocation)
  .then(function(transitTime) {
    console.log(transitTime);
    res.send(201, {time: transitTime});
  });
  
  user.save(function(err,user){
    if(err) return console.error(err);
    console.log('User settings saved', user);
  });


};

exports.getRoutes = function(req, res) {
  maps.getDirections('37.7577,-122.4376', '37.783542,-122.408943')
  .then(function(data) {
    maps.getTransitTime('37.7577,-122.4376', '37.783542,-122.408943')
    .then(function(transitTime) {
      console.log(transitTime);
      res.send(200, {time: transitTime, route: data}); 
    });
  });
};
