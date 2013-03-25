
var esprima = require('esprima'),
  escodegen = require('escodegen'),
  markASTModules = require('./lib/mark-ast-modules'),
  annotateAST = require('./lib/annotate-ast');

/*
 * Given a JavaScript string, annotate the injectable AngularJS module methods
 */
var annotate = exports.annotate = function (inputCode) {
  var syntax = esprima.parse(inputCode, {
    tolerant: true
  });

  while (markASTModules(syntax)) {}
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
