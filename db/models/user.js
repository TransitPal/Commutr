var db = require('mongoose');

exports.User = mongoose.model('User',{
  name: String,
  id: Number,
  homeAddress: String,
  homeLocation: {lat: Number, lng: Number},
  workAddress: String,
  workLocation: {lat: Number, lng: Number},
  routine: {
    workTime: Number,
    homeTime: Number
  }
});