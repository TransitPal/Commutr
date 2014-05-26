/* global require */
'use strict';

var gm = require('googlemaps');
var request = require('request');
var utils = require('./utils');

gm.config('key', process.env.GOOGLE_API_KEY);

module.exports.getDirections = function(startLoc, endLoc, callback) {
  gm.directions(startLoc, endLoc, callback);
};