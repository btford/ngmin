/*
 * Test cases where there's a reference to a module
 *
 *     var myMod = angular.module('myMod', []);
 *     myMod.controller( ... )
 *
 */

var assert = require('should');

// so we don't have to put the stuff we're testing into a string
var stringifyFunctionBody = require('./util.js').stringifyFunctionBody;
var annotate = function (arg) {
  return require('../main').annotate(
    stringifyFunctionBody(arg));
};


describe('annotate', function () {

  it('should annotate declarations on referenced modules', function () {
    var annotated = annotate(function () {
      var myMod = angular.module('myMod', []);
      myMod.controller('MyCtrl', function ($scope) {});
    });

    annotated.should.equal(stringifyFunctionBody(function () {
      var myMod = angular.module('myMod', []);
      myMod.controller('MyCtrl', [
        '$scope',
        function ($scope) {
        }
      ]);
    }));
  });

  it('should annotate declarations on referenced modules when reference is declared then initialized', function () {
    var annotated = annotate(function () {
      var myMod;
      myMod = angular.module('myMod', []);
      myMod.controller('MyCtrl', function ($scope) {});
    });

    annotated.should.equal(stringifyFunctionBody(function () {
      var myMod;
      myMod = angular.module('myMod', []);
      myMod.controller('MyCtrl', [
        '$scope',
        function ($scope) {
        }
      ]);
    }));
  });

  it('should not annotate declarations on non-module objects', function () {
    var fn = function () {
      var myMod, myOtherMod;
      myMod = angular.module('myMod', []);
      myOtherMod.controller('MyCtrl', function ($scope) {});
    };
    var annotated = annotate(fn);
    annotated.should.equal(stringifyFunctionBody(fn));
  });


});
