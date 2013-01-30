
/*
 * Test utils
 */


var esprima = require('esprima'),
  escodegen = require('escodegen');

var fnDecl = /^[ ]*function[ ]?\(\)[ ]?\{\n/m,
  trailingBrace = /[ ]*\}(?![\s\S]*\})/m;

// given a function, return its body as a string.
// makes tests look a bit cleaner
exports.stringifyFunctionBody = function (fn) {
  var out = fn.toString().
    replace(fnDecl, '').
    replace(trailingBrace, '');

  // then normalize with esprima/escodegen
  out = escodegen.generate(
    esprima.parse(out, {
      tolerant: true
    }), {
      format: {
        indent: {
          style: '  '
        }
      }
    });

  return out;
};
