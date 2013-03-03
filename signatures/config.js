
/*
 * module.config AST structure to match against
 * ex: `angular.config(function ( ... ) { ... })`
 */

var signature = module.exports = {
  "type": "ExpressionStatement",
  "expression": {
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": {
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
      },
      "property": {
        "type": "Identifier",
        "name": "config"
      }
    },
    "arguments": [
      {
        "type": "FunctionExpression",
        "body": {
          "type": "BlockStatement",
          "body": []
        }
      }
    ]
  }
};
