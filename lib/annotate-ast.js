
var deepApply = require('./deep-apply');


// look for `modRef.fn` in AST
var signatures = require('../signatures/simple');

var annotateInjectables = function(originalFn) {
  // if there's nothing to inject, don't annotate
  if (originalFn.params.length === 0) {
    return originalFn;
  }

  var newParam = {
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
  return newParam;
};


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
    chunk.arguments[argIndex] = annotateInjectables(chunk.arguments[argIndex]);
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
        controllerChunk.value = annotateInjectables(controllerChunk.value);
      });
    });
  });

  // PDO annotations

  deepApply(syntax, [{
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": {
        "ngModule": true
      },
      "property": {
        "type": "Identifier",
        "name": "provider"
      }
    }
  }], function (providerChunk) {
    deepApply(providerChunk, [{
      "type": "ExpressionStatement",
      "expression": {
        "type": "AssignmentExpression",
        "left": {
          "type": "MemberExpression",
          "object": {
            "type": "ThisExpression"
          },
          "property": {
            "type": "Identifier",
            "name": "$get"
          }
        },
        "right": {
          "type": "FunctionExpression"
        }
      }
    }], function(pdoChunk) {
      pdoChunk.expression.right = annotateInjectables(pdoChunk.expression.right);
    });
  });

};
