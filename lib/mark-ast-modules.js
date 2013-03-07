
/*
 * Add {"ngModule": true} property to matching modules
 */

var deepApply = require('./deep-apply');

var signatures = [
  require('../signatures/module')
].concat(require('../signatures/simple'));

// TODO: name(chunk)
var standards = [
  {
    // extract id from AST
    id: function (branch) {
      return branch.id.name;
    },
    chunk: require('../signatures/decl')
  },

  {
    id: function (branch) {
      return branch.expression.left.name;
    },
    chunk: require('../signatures/assign')
  }
];


//TODO: honor scope

var markASTModules = module.exports = function (syntax) {
  signatures.forEach(function (signature) {
    deepApply(syntax, signature, function (chunk) {
      chunk.ngModule = true;
    });
  });


  // module ref ids
  var modules = [];

  // grab all module ref ids
  standards.forEach(function (standard) {
    deepApply(syntax, standard.chunk, function (branch) {
      var id = standard.id(branch);
      if (modules.indexOf(id) === -1) {
        modules.push(id);
      }
    });
  });

  [{
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": new RegExp('^(' + modules.join('|') + ')$')
      },
      "property": {
        "type": "Identifier",
        "name": /^(controller|directive|filter|service|factory|decorator|provider)$/
      }
    },
    "arguments": [
      {},
      {
        "type": "FunctionExpression"
      }
    ]
  },
  {
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": new RegExp('^(' + modules.join('|') + ')$')
      },
      "property": {
        "type": "Identifier",
        "name": "config"
      }
    },
    "arguments": [
      {
        "type": "FunctionExpression"
      }
    ]
  }].forEach(function (signature) {
    deepApply(syntax, signature, function (chunk) {
      chunk.callee.object.ngModule = true;
    });
  });

};
