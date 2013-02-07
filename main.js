
var esprima = require('esprima'),
    escodegen = require('escodegen'),
    signatures = require('./signature'),
    deepCompare = require('./util/deep-compare');


/*
 * Modifies AST to add annotations to injectable AngularJS module methods
 */
var annotateAngularModule = function (syntax) {

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

/**
 * replaces $angular.some.package.controllers.FooCtrl = function(...) with angular.module("some.package").controller('FooCtrl', function(...))
 * @param syntax
 */
var annotate$Angular = function(syntax) {
    var replace = signatures.replace$angular;

    function clone(x) {
        if (x.clone)
            return x.clone();
        if (x.constructor == Array)
        {
            var r = [];
            for (var i=0,n=x.length; i<n; i++)
                r.push(clone(x[i]));
            return r;
        }
        return x;
    }

    syntax.body.forEach(function (chunk) {
        //console.log(JSON.stringify(chunk, null , "   "));
        if(chunk.type ===  "ExpressionStatement" && chunk.expression.type == "AssignmentExpression") {
            if(chunk.expression.right.type === "FunctionExpression") {
                var paths = [];
                function deep(part) {
                    // console.log(part.type);
                    if(part.type === "MemberExpression") {
                        paths.unshift(part.property.name);
                        deep(part.object);
                    } else if(part.type == "Identifier" && part.name == "$angular") {
                        paths.unshift(part.name);
                    }
                }
                deep(chunk.expression.left);
                //console.log(paths);
            }
            if(paths && paths.length > 0 && paths[0] == "$angular") {
                var func = chunk.expression.right;
                var val = clone(replace);
                //console.log(func);

                chunk.type = val.type;
                chunk.expression = val.expression;
                paths.shift();
                var name = paths.pop();
                var method = paths.pop();
                var path = paths.join(".");
                method = (method === "factories" ? "factory" : method.substr(0, method.length - 1));
                chunk.expression.callee.object.arguments[0].value = path;
                chunk.expression.callee.property.name = method;
                chunk.expression.arguments = [{type:"Literal", value:name}, func];
                //console.log(name, method, path);
            }
        }
    });
}

/*
 * Given a JavaScript string, annotate the injectable AngularJS module methods
 */
var annotate = exports.annotate = function (inputCode) {
    //inputCode = "$angular.foo.bar.services.NAME = function(foo, bar){}";
    //inputCode = "angular.module('foo.bar').METHOD(function(foo, bar){})";
    var syntax = esprima.parse(inputCode, {
        tolerant: true
    });

    annotate$Angular(syntax);
    annotateAngularModule(syntax);

    var generatedCode = escodegen.generate(syntax, {
        format: {
            indent: {
                style: '  '
            }
        }
    });

    return generatedCode;
};
