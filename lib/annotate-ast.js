
var deepApply = require('./deep-apply');
var annotateInjectable = require('./annotate-injectable');


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
    chunk.arguments[argIndex] = annotateInjectable(chunk.arguments[argIndex]);
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
        controllerChunk.value = annotateInjectable(controllerChunk.value);
      });
    });
  });

  // PDO annotations - defined by object

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
      "type": "ObjectExpression"
    }], function(objectChunk) {
      objectChunk.properties.forEach(function(property) {
        deepApply(property, [{
          "type": "Property",
          "key": {
            "type": "Identifier",
            "name": "$get"
          },
          "value": {
            "type": "FunctionExpression"
          }
        }], function(propertyChunk) {
          propertyChunk.value = annotateInjectable(propertyChunk.value);
        });
      });
    });
  });

  // PDO annotations - defined by function

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
      pdoChunk.expression.right = annotateInjectable(pdoChunk.expression.right);
    });
  });

};
