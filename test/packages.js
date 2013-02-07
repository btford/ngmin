/*
 * Test simple cases
 *
 *     angular.module('myMod').controller( ... );
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

  it('should annotate controllers', function () {
    var annotated = annotate(function () {
      $angular.myMod.controllers.MyCtrl = function ($scope) {};
    });

    annotated.should.equal(stringifyFunctionBody(function () {
      angular.module('myMod').controller('MyCtrl', [
        '$scope',
        function ($scope) {
        }
      ]);
    }));
  });


  it('should annotate directives', function () {
    var annotated = annotate(function () {
        $angular.myMod.directives.myDirective = function ($rootScope) {
            return {
                restrict: 'E',
                template: 'sup'
            };
        };
    });

    annotated.should.equal(stringifyFunctionBody(function () {
      angular.module('myMod').directive('myDirective', [
        '$rootScope',
        function ($rootScope) {
          return {
            restrict: 'E',
            template: 'sup'
          };
        }
      ]);
    }));
  });


  it('should annotate filters', function () {
    var annotated = annotate(function () {
       $angular.myMod.filters.myFilter = function (dep) {};
    });

    annotated.should.equal(stringifyFunctionBody(function () {
      angular.module('myMod').filter('myFilter', [
        'dep',
        function (dep) {
        }
      ]);
    }));
  });


  it('should annotate services', function () {
    var annotated = annotate(function () {
        $angular.myMod.services.myService = function (dep) {};
    });

    annotated.should.equal(stringifyFunctionBody(function () {
      angular.module('myMod').service('myService', [
        'dep',
        function (dep) {
        }
      ]);
    }));
  });


  it('should annotate factories', function () {
    var annotated = annotate(function () {
        $angular.myMod.factories.factory = function (dep) {};
    });

    annotated.should.equal(stringifyFunctionBody(function () {
      angular.module('myMod').factory('factory', [
        'dep',
        function (dep) {
        }
      ]);
    }));
  });


  it('should annotate decorators', function () {
    var annotated = annotate(function () {
        $angular.myMod.decorators.myService = function (dep) {};
    });

    annotated.should.equal(stringifyFunctionBody(function () {
      angular.module('myMod').decorator('myService', [
        'dep',
        function (dep) {
        }
      ]);
    }));
  });


  it('should annotate config', function () {
    var annotated = annotate(function () {
        $angular.myMod.configs.push(function (dep) {});
    });

    annotated.should.equal(stringifyFunctionBody(function () {
      angular.module('myMod').config([
        'dep',
        function (dep) {
        }
      ]);
    }));
  });


  it('should annotate providers', function () {
    var annotated = annotate(function () {
        $angular.myMod.providers.myService = function (dep) {};
    });

    annotated.should.equal(stringifyFunctionBody(function () {
      angular.module('myMod').provider('myService', [
        'dep',
        function (dep) {
        }
      ]);
    }));
  });


  it('should not annotate constants', function () {
    var annotated = annotate(function () {
        $angular.myMod.constants.fortyTwo = 42;
    });

    annotated.should.equal(stringifyFunctionBody(function () {
      angular.module('myMod').constant('fortyTwo', 42);
    }));
  });


  it('should not annotate values', function () {
    var annotated = annotate(function () {
        $angular.myMod.values.fortyTwo = 42;
    });

    annotated.should.equal(stringifyFunctionBody(function () {
      angular.module('myMod').value('fortyTwo', 42);
    }));
  });

});
