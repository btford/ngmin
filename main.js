
var esprima = require('esprima'),
  escodegen = require('escodegen'),
  astral = require('astral')();

// register angular annotator in astral
require('astral-angular-annotate')(astral);

var annotate = exports.annotate = function (inputCode) {

  var ast = esprima.parse(inputCode, {
    tolerant: true
  });

  astral.run(ast);

  var generatedCode = escodegen.generate(ast, {
    format: {
      indent: {
        style: '  '
      }
    }
  });

  return generatedCode;
};
