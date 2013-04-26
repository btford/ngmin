
/*
 * Simple AST structure to match against
 * ex: `angular.module('whatevs').controller( ... )`
 */

var constantOrValue = {
  "type": "CallExpression",
  "callee": {
    "type": "MemberExpression",
    "object": {
      "ngModule": true
    },
    "property": {
      "type": "Identifier",
      "name": /^(constant|value)$/
    }
  },
  "arguments": [
    {},
    {}
  ]
};

module.exports = [
constantOrValue,
{
  "type": "CallExpression",
  "callee": {
    "type": "MemberExpression",
    "object": {
      "ngModule": true
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
      "ngModule": true
    },
    "property": {
      "type": "Identifier",
      "name": /^(config|run)$/
    }
  },
  "arguments": [
    {
      "type": "FunctionExpression"
    }
  ]
},
constantOrValue
];
