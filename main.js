
var esprima = require('esprima'),
  escodegen = require('escodegen'),
  signature = require('./signature'),
  deepCompare = require('./util/deep-compare');


/*
 * Modifies AST to add annotations to injectable AngularJS module methods
 */
var annotateAST = function (syntax) {

  // locate angular modules and references
  syntax.body

  // rewrite each matching chunk
  syntax.body.forEach(function (chunk) {
    var originalFn, newParam;
    if (deepCompare(chunk, signature)) {
      originalFn = chunk.expression.arguments[1];
      newParam = chunk.expression.arguments[1] = {
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
    }
  });
};


/*
 * Given a JavaScript string, annotate the injectable AngularJS module methods
 */
var annotate = exports.annotate = function (inputCode) {
  var syntax = esprima.parse(inputCode, {
    tolerant: true
  });

  annotateAST(syntax);

  var generatedCode = escodegen.generate(syntax, {
    format: {
        indent: {
            style: '    '
        }
    }
  });

  return generatedCode;
};
