
var esprima = require('esprima'),
  escodegen = require('escodegen'),
  astral = require('astral')(),
  sourceMap = require('source-map'),
  fs = require('fs');

// register angular annotator in astral
require('astral-angular-annotate')(astral);

var annotate = exports.annotate = function (inputCode, options) {
  options = options || {};
  options.sourceMap = options.sourceMap || null;
  options.sourceMapRoot = options.sourceMapRoot || null;
  options.sourceMapIn = options.sourceMapIn || null;
  options.sourceFile = options.sourceFile || null;

  var mapIn = null;

  if (options.sourceMapIn) {
    mapIn = new sourceMap.SourceMapConsumer(JSON.parse(fs.readFileSync(options.sourceMapIn)));
  }

  var ast = esprima.parse(inputCode, {
    tolerant: true,
    loc: true
  });

  astral.run(ast);

  var generatedCode = escodegen.generate(ast, {
    format: {
      indent: {
        style: '  '
      }
    },
    sourceMap: options.sourceMap && options.sourceFile ? options.sourceFile : undefined,
    sourceMapRoot: options.sourceMapRoot,
    sourceMapWithCode: true
  });

  if ('string' === typeof generatedCode) {
    generatedCode = { code: generatedCode };
  }

  if (generatedCode.map) {
    if (mapIn) {
      generatedCode.map.applySourceMap(mapIn);
    }
  }

  return generatedCode;
};
