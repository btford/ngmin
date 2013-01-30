/*
 * Test chained declarations
 *     angular.module('myMod', []).
 *       controller( ... ).
 *       controller( ... );
 */


var assert = require('should');

// so we don't have to put the stuff we're testing into a string
var stringifyFunctionBody = require('./util.js').stringifyFunctionBody;
var annotate = function (arg) {
  return require('../main').annotate(
    stringifyFunctionBody(arg));
};


describe('annotate', function () {

  it('should annotate chained declarations', function () {
    var annotated = annotate(function () {
      angular.module('myMod', []).
        service('myService', function (dep) {}).
        service('MyCtrl', function ($scope) {});
    });

    console.log(annotated);

    annotated.should.equal(stringifyFunctionBody(function () {
      angular.module('myMod', []).
        service('myService', ['dep', function (dep) {}]).
        service('MyCtrl', ['$scope', function ($scope) {}]);
    }));
  });

});
