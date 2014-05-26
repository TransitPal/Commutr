var gm = require('googlemaps');

gm.config('key', process.env.GOOGLE_API_KEY);

module.exports.getDirections = function(startLoc, endLoc, callback) {
  gm.directions(startLoc, endLoc, callback);
};
