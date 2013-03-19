
var deepApply = require('./deep-apply');


// look for `modRef.fn` in AST
var signatures = require('../signatures/simple');


/*
 * Modifies AST to add annotations to injectable AngularJS module methods
 */
var annotateAST = module.exports = function (syntax) {

  signatures.forEach(function (signature) {
    // rewrite each matching chunk
    deepApply(syntax, signature, function (chunk) {
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
  });

};
