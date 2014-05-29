var db = require('mongoose');

exports.getUserLocations = function(email, callback){
  db.models.User.find({email:email},function(err,user){
    if(err) return console.error(err);
    callback(user);
  });
}