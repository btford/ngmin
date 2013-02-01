{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "myMod"
          },
          "init": {
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
                "value": "myMod"
              },
              {
                "type": "ArrayExpression",
                "elements": []
              }
            ]
          }
        }
      ],
      "kind": "var"
    }
  ],
  "errors": []
}
