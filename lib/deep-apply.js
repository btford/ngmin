/*
 * Checks each property of the standard recursively against the candidate,
 * runs `cb` on all branches that match the standard
 */

var deepCompare = require('./deep-compare.js');

var deepApply = module.exports = function (candidate, standard, cb) {
  // depth-first
  for (var prop in candidate) {
    if (candidate.hasOwnProperty(prop)) {

      // array
      if (candidate[prop] instanceof Array) {
        for (var i = 0; i < candidate[prop].length; i += 1) {
          deepApply(candidate[prop][i], standard, cb);
        }

      // object
      } else if (typeof candidate[prop] === 'object') {
        deepApply(candidate[prop], standard, cb);
      }
    }
  }

  if (deepCompare(candidate, standard)) {
    cb(candidate);
  }
};
