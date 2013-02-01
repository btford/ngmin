var deepCompare = require('./deep-compare');

// attempt to find the standard within the candidate.
// returns tree of arrays representing the path followed
// to all locations that match
var deepFind = module.exports = function (candidate, standard) {
  var ret = [], cur;
  for (var prop in candidate) {
    if (candidate.hasOwnProperty(prop) &&
        typeof candidate[prop] === 'object' &&
        (cur = deepFind(candidate[prop], standard)) &&
        cur.length > 0) {

      ret.push([prop, cur]);
    }
  }
  if (deepCompare(candidate, standard)) {
    ret.push(['.']);
  }
  if (ret.length === 1) {
    return ret[0];
  }
  return ret;
};
