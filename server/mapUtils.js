var gm = require('googlemaps');
var Q = require('q');

gm.config('key', process.env.GOOGLE_API_KEY);
var directions = Q.denodeify(gm.directions);

var getDirections = function(startLoc, endLoc) {
  return directions(startLoc, endLoc);
};

var getTransitTime = function(startLoc, endLoc) {
  return getDirections(startLoc, endLoc)
         .then(function(data) {
           var transitTime = 0;
           var routeLegs = data.routes[0].legs;
           for (var i = 0; i < routeLegs.length; i++) {
             transitTime += routeLegs[i].duration.value;
           }
           return transitTime;
         });
};

module.exports = {
  getDirections: getDirections,
  getTransitTime: getTransitTime
};