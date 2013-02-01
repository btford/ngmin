# ngmin
[![Build Status](https://travis-ci.org/btford/ngmin.png?branch=master)](https://travis-ci.org/btford/ngmin)

ngmin is an _experimental_ AngularJS application minifier. Experimental means this **should not** yet be used in production, but you **should** try it out and let me know what you think. The goal is ultimately to use this alongside yeoman and grunt to make developing and building Angular apps fast, easy, and fun.

## Installation
Install via npm:
```bash
npm install -g ngmin
```

## CLI Usage

```bash
ngmin somefile.js somefile.annotate.js
```

From here, you can concat and pass the annotated files to a minifier. Future versions of ngmin will include a minifier, probably based on Google Closure Compiler.

## Conventions
ngmin does not currently attempt to be fully generalized. If you follow these conventions, which are largely the same as what the AngularJS Yeoman generators are configured to do, you should be fine.

### Module Declaration

```javascript
// like this
angular.module('myModuleName', ['dependOnThisModule']);
```

### Controller Declaration

```javascript
// like this
angular.module('myModuleName').controller('MyCtrl', function ($scope) {
  // ...
});
```

### Service Declaration
This should work for all injectable APIs.

```javascript
// like this
angular.module('myModuleName').service('MyCtrl', function ($scope) {
  // ...
});
```

## Conceptual Overview
AngularJS's DI system inspects function parameters to determine what to inject:
```javascript
// angular knows to inject "myService" based on the parameter in "myFactory"
someModule.factory('myFactory', function (myService) {
  // ...
});
```
AngularJS does this for `Module#controller`, `Module#service`, `Module#factory`, etc. Check out the [developer guide on DI](http://docs.angularjs.org/guide/di) for more info.

JavaScript minifiers rename function parameters. The code above, when minified, might look like this:
```javascript
// the "myService" parameter has been renamed to "a" to save precious bytes
someModule.factory('myFactory', function (a) {
  // ...
});
```

To overcome this, AngularJS has a minifier-safe "inline" notation (see [Inline Annotation](http://docs.angularjs.org/guide/di) in the docs) that annotates `angular.controller`, `angular.service`, `angular.factory` with an array of dependencies' names as strings:
```javascript
// angular knows to inject "myService" based on the parameter in "myFactory"
someModule.factory('myFactory', ['myService', function (myService) {
  // ...
}]);
```

So with this notation, when minified, still includes the correct dependency names even if the function arguments are re-written:
```javascript
someModule.factory('myFactory', ['myService', function (a) {
  // minified variable "a" will represent "myService"
  // ...
}]);
```

Writing the "minifier-safe" version by hand is kind of annoying because you have to keep both the array of dependency names and function parameters in sync.
