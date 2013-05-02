
var deepApply = require('./deep-apply');


// look for `modRef.fn` in AST
var signatures = require('../signatures/simple');


/*
 * Modifies AST to add annotations to injectable AngularJS module methods
 */
var annotateAST = module.exports = function (syntax) {

  // rewrite each matching chunk
  deepApply(syntax, signatures, function (chunk) {
    var originalFn,
      newParam,
      type;

    try {
      type = chunk.callee.property.name;
    }
    catch (e) {}

    var argIndex = 1;
    if (type === 'config' || type === 'run') {
      argIndex = 0;
    }

    if (type === 'constant' || type === 'value') {
      return;
    }
    originalFn = chunk.arguments[argIndex];

    // if there's nothing to inject, don't annotate
    if (originalFn.params.length === 0) {
      return;
    }

    newParam = chunk.arguments[argIndex] = {
      type: 'ArrayExpression',
      elements: []
    };

    originalFn.params.forEach(function (param) {
      newParam.elements.push({
        "type": "Literal",
        "value": param.name
      });
    });
    newParam.elements.push(originalFn);
  });


  // DDO annotations

  deepApply(syntax, [{
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": {
        "ngModule": true
      },
      "property": {
        "type": "Identifier",
        "name": "directive"
      }
    }
  }], function (directiveChunk) {
    deepApply(directiveChunk, [{
      "type": "ReturnStatement",
      "argument": {
        "type": "ObjectExpression"
      }
    }], function (returnChunk) {
      deepApply(returnChunk, [{
        "type": "Property",
        "key": {
          "type": "Identifier",
          "name": "controller"
        },
        "value": {
          "type": "FunctionExpression"
        }
      }], function (controllerChunk) {
        var originalFn = controllerChunk.value;


        // if there's nothing to inject, don't annotate
        if (originalFn.params.length === 0) {
          return;
        }

        var newParam = controllerChunk.value = {
          type: 'ArrayExpression',
          elements: []
        };

        originalFn.params.forEach(function (param) {
          newParam.elements.push({
            "type": "Literal",
            "value": param.name
          });
        });
        newParam.elements.push(originalFn);
      });
    });
  });

};
