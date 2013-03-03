
var esprima = require('esprima'),
  escodegen = require('escodegen'),
  deepApply = require('./util/deep-apply'),
  deepCompare = require('./util/deep-compare');


/*
 * Modifies AST to add annotations to injectable AngularJS module methods
 */
var annotateAST = function (syntax) {

  var standards = [{
    "type": "VariableDeclarator",
    "init": {
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "object": {
          "type": "Identifier",
          "name": "angular"
        },
        "property": {
          "type": "Identifier",
          "name": "module"
        }
      }
    }
  },
  {
    "type": "ExpressionStatement",
    "expression": {
      "type": "AssignmentExpression",
      "operator": "=",
      "left": {
        "type": "Identifier"
      },
      "right": {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "object": {
            "type": "Identifier",
            "name": "angular"
          },
          "property": {
            "type": "Identifier",
            "name": "module"
          }
        }
      }
    }
  }];

  // module ref ids
  var modules = [];

  // extract id from AST
  var extractors = [
    function (branch) {
      return branch.id.name;
    },
    function (branch) {
      return branch.expression.left.name;
    }
  ];

  // grab all module ref ids
  standards.forEach(function (standard, i) {
    var extractor = extractors[i];
    deepApply(syntax, standard, function (branch) {
      var id = extractor(branch);
      if (modules.indexOf())
      modules.push(extractor(branch));
    });
  });

  // look for `modRef.fn` in AST
  var signatures = [
  require('./signatures/simple'),
  {
    "type": "ExpressionStatement",
    "expression": {
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "object": {
          "type": "Identifier",
          "name": new RegExp('^(' + modules.join('|') + ')$')
        },
        "property": {
          "type": "Identifier",
          "name": /^(controller|directive|filter|service|factory|decorator|config|provider)$/
        }
      },
      "arguments": [
        {
          "type": "Literal"
        },
        {
          "type": "FunctionExpression",
          "body": {
            "type": "BlockStatement",
            "body": []
          }
        }
      ]
    }
  }
  ];

  signatures.forEach(function (signature) {
    // rewrite each matching chunk
    deepApply(syntax, signature, function (chunk) {
      var originalFn, newParam;
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
    });
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
        style: '  '
      }
    }
  });

  return generatedCode;
};
