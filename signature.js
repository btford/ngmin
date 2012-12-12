
// look for this structure in the AST
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
        "name": /^(controller|directive|filter|service|factory|decorator)$/
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
};
