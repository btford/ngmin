var esprima = require('esprima'),
  fs = require('fs');

var deepFind = require('./util/deep-find');

/*
console.log(JSON.stringify(esprima.parse(fs.readFileSync('test-input.js'), {
  tolerant: true
})));
*/

var parsed = esprima.parse(fs.readFileSync('test-input.js'), {
  tolerant: true
});

var standard = {
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
};

console.log(JSON.stringify(deepFind(parsed, standard)));
