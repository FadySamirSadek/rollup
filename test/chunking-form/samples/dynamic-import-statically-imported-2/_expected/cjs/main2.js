'use strict';

new Promise(function (resolve) { resolve(require('./generated-dep1.js')); }).then(({ bar }) => console.log(bar()));
