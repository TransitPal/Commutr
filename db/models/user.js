var db = require('mongoose');

exports.User = db.model('User',{
  name: String,
  email: {type: String, unique: true, required: true},
  homeAddress: String,
  homeLocation: {lat: Number, lng: Number},
  workAddress: String,
  workLocation: {lat: Number, lng: Number},
  routine: {
    workTime: Number,
    homeTime: Number
  }
});