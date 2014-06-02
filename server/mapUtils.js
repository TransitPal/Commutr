var gm = require('googlemaps');
var Q = require('q');

gm.config('key', process.env.GOOGLE_API_KEY);
var directions = Q.denodeify(gm.directions);
var geocode = Q.denodeify(gm.geocode);

var getDirections = function(startLoc, endLoc) {
  var queryStart = startLoc.lat + ',' + startLoc.lng;
  var queryEnd = endLoc.lat + ',' + endLoc.lng;
  // returns promise
  return directions(queryStart, queryEnd);
};

var getTransitTime = function(route) {
  var transitTime = 0;
  var routeLegs = route.routes[0].legs;
  for (var i = 0; i < routeLegs.length; i++) {
    transitTime += routeLegs[i].duration.value;
  }
  return transitTime;
};

var getLatLong = function(address) {
  return geocode(address).then(function(geoCodeData) {
    return geoCodeData.results[0].geometry.location;
  });
};

module.exports = {
  getDirections: getDirections,
  getTransitTime: getTransitTime,
  getLatLong: getLatLong
};
