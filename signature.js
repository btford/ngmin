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

module.exports.replace$angular = {
    "type": "ExpressionStatement",
    "expression": {
        "type": "CallExpression",
        "callee": {
            "type": "MemberExpression",
            "computed": false,
            "object": {
                "type": "CallExpression",
                "callee": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": "angular"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "module"
                    }
                },
                "arguments": [
                    {
                        "type": "Literal",
                        "value": "XXX.XXX"
                    }
                ]
            },
            "property": {
                "type": "Identifier",
                "name": "XXXX"
            }
        },
        "arguments": [
            {
                "type": "FunctionExpression",
                "id": null,
                "params": [
                    {
                        "type": "Identifier",
                        "name": "foo"
                    },
                    {
                        "type": "Identifier",
                        "name": "bar"
                    }
                ],
                "defaults": [],
                "body": {
                    "type": "BlockStatement",
                    "body": []
                },
                "rest": null,
                "generator": false,
                "expression": false
            }
        ]
    }
}
