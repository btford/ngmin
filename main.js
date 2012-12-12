/*jslint node:true sloppy:true plusplus:false strict:false */
var esprima = require('esprima'),
    escodegen = require('escodegen'),
    fs = require('fs'),
    filename = process.argv[2];

// look for this structure in the AST
var signature = {
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
        },
        "arguments": [
          {
            "type": "Literal"
          },
          {
            "type": "ArrayExpression"
          }
        ]
      },
      "property": {
        "type": "Identifier",
        "name": /^(controller|service|factory)$/
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

var deepCompare = function (candidate, standard) {
  for (var prop in standard) {
    if (standard.hasOwnProperty(prop)) {

      // undefinded case
      if (!candidate[prop]) {
        console.log(prop);
        return false;

      // regex
      } else if (standard[prop] instanceof RegExp) {
        if (!standard[prop].test(candidate[prop])) {
          console.log(prop);
          return false;
        }

      // array
      } else if (standard[prop] instanceof Array) {
        for (var i = 0; i < standard[prop].length; i++) {
          if (!deepCompare(candidate[prop][i], standard[prop][i])) {
            return false;
          }
        }

      // object
      } else if (typeof standard[prop] === 'object') {
        if (!deepCompare(candidate[prop], standard[prop])) {
          return false;
        }

      // primative case
      } else if (candidate[prop] !== standard[prop]) {
        console.log(prop);
        return false;
      }
    }
  }
  return true;
};

content = fs.readFileSync(filename, 'utf-8');
var syntax = esprima.parse(content, {
  tolerant: true
});

syntax.body.forEach(function (chunk) {
  var originalFn, newParam;
  if (deepCompare(chunk, signature)) {
    originalFn = thing.expression.arguments[1];
    newParam = thing.expression.arguments[1] = {
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
  }
});

var generatedCode = escodegen.generate(syntax, {
  format: {
    indent: {
      style: '  '
    }
  }
});

fs.writeFileSync(filename.substr(0, filename.length-2) + 'out.js', generatedCode);
