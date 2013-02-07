
var esprima = require('esprima'),
    escodegen = require('escodegen'),
    signatures = require('./signature'),
    deepCompare = require('./util/deep-compare');


/*
 * Modifies AST to add annotations to injectable AngularJS module methods
 */
var annotateAST = function (syntax) {

    // locate angular modules and references
    syntax.body

    // rewrite each matching chunk
    syntax.body.forEach(function (chunk) {
        signatures.forEach(function(signature) {
            var originalFn, newParam;
            if (deepCompare(chunk, signature)) {
                var idx = chunk.expression.arguments.length - 1;
                originalFn = chunk.expression.arguments[idx];
                newParam = chunk.expression.arguments[idx] = {
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
