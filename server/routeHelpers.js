var models = require('../db/models/user');

exports.placeholder = function(req, res){
  res.send(200, 'Hello, world! ^_^');
};

exports.getRoutes = function(req, res){
  res.send(200, [{route: null}]);
};

exports.saveUser = function(req, res){
  var settings = req.user;
  var user = new models.User({
    name: settings.name,
    email: settings.email,
    homeAddress: settings.homeAddress,
    // Seed data until Google APIs are set up
    homeLocation: {lat: 37.783542, lng: -122.408943},
    workAddress: settings.workAddress,
    // Seed data until Google APIs are set up
    workLocation: {lat: 37.7746071, lng: -122.4260718},
    routine: settings.routine
  });

  user.save(function(err,user){
    if(err) return console.error(err);
    console.log('User settings saved', user);
  });

  res.send(201);
};