var gm = require('googlemaps');
var Q = require('q');

gm.config('key', process.env.GOOGLE_API_KEY);
var directions = Q.denodeify(gm.directions);

module.exports.getDirections = function(startLoc, endLoc) {
  return directions(startLoc, endLoc);
};
