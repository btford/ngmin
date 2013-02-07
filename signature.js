// look for this structure in the AST
module.exports = [
    // moduleVariable.service(...)
    {
        "type": "ExpressionStatement",
        "expression": {
            "type": "CallExpression",
            "callee": {
                "type": "MemberExpression",
                "object": {
                    "type": "Identifier",
                    "name": /^.*$/
                },
                "property": {
                    "type": "Identifier",
                    "name": /^(controller|directive|filter|service|factory|decorator|provider)$/
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
    },
    // angular.module(...).service(...)
    {
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
                    "name": /^(controller|directive|filter|service|factory|decorator|provider)$/
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
    },
    // angular.module(...).config(...)
    {
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
                    "name": /^(config)$/
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
    }
];

