'use strict';

var clc     = require('cli-color');
var pkg     = require('./package.json');
var program = require('commander');
var app     = require('./app');
var config;
var result;

program.version(pkg.version)
         .option('-c, --config <Path>', 'Path to arcan.config.js file')
         .parse(process.argv);

if (program.config) {

    config = require(program.config);
    result = app(program.args[0], config);
    console.log(clc.red(result));

}