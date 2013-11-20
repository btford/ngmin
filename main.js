
var esprima = require('esprima'),
  escodegen = require('escodegen'),
  findup = require('findup-sync'),
  globule = require('globule'),
  astral = require('astral')();

function arrayify(el) {
  return Array.isArray(el) ? el : [el];
}

var annotate = exports.annotate = function (inputCode, options) {
  options = options || {};

  var pattern = arrayify(options.pattern || ['astral-angular-annotate-*']);
  var config = options.config || findup('package.json');
  var scope = arrayify(options.scope || ['dependencies', 'devDependencies', 'peerDependencies']);

  if (typeof config === 'string') {
    config = require(config);
  }

  var names = scope.reduce(function (result, prop) {
    return result.concat(Object.keys(config[prop] || {}));
  }, []);

  // register angular annotator in astral
  require('astral-angular-annotate')(astral);
  globule.match(pattern, names).forEach(function (annotation) {
    require(annotation)(astral);
  });

  var ast = esprima.parse(inputCode, {
    tolerant: true,
    comment: true,
    range: true,
    tokens: true
  });
  // TODO: unstable API, see https://github.com/Constellation/escodegen/issues/10
  ast = escodegen.attachComments(ast, ast.comments, ast.tokens);

  astral.run(ast);

  var generatedCode = escodegen.generate(ast, {
    format: {
      indent: {
        style: '  '
      }
    },
    comment: true
  });

  return generatedCode;
};
