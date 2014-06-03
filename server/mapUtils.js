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
  if (!route) { return null; }
  return route.routes[0].legs[0].duration.value;
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
