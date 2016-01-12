'use strict';

var R       = require('ramda');
var fs      = require('fs');
var path    = require('path');
var files   = fs.readdirSync(__dirname);
var modules = {};

files.forEach(function(file) {

   if (file !== 'index.js' && /\.js$/.test(file)) {

       modules = R.merge(modules, require(path.join(__dirname, file)));

   }

});

module.exports = modules;