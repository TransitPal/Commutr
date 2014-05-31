var db = require('mongoose');

exports.getUserLocations = function(email){
  return db.models.User.findOne({email:email}).select('homeLocation workLocation').exec();
};
