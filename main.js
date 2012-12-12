
var esprima = require('esprima'),
  escodegen = require('escodegen'),
  signature = require('./signature'),
  deepCompare = require('./util/deep-compare');

var annotateAST = function (syntax) {
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

var annotate = exports.annotate = function (inputCode) {
  var syntax = esprima.parse(inputCode, {
    tolerant: true
  });

  annotateAST(syntax);

  var generatedCode = escodegen.generate(syntax, {
    format: {
      indent: {
        style: '  '
      }
    }
  });

  return generatedCode;
};
