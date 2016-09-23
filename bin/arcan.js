#! /usr/bin/env node

var fs            = require('fs');
var path          = require('path');
var defaultConfig = path.join(process.cwd(), 'arcan.config.js');
var clc           = require('cli-color');
var pkg           = require('../package.json');
var program       = require('commander');
var app           = require('../app');
var config;
var result;

program.version(pkg.version)
         .usage('<directory>')
         .option('-c, --config <path>', 'path to arcan.config.js file')
         .parse(process.argv);

if (program.args.length < 1 || (!program.config && !fs.existsSync(defaultConfig))) {

    console.log(program.help());
    process.exit(0);

}

if (program.config) {

    config = require(path.resolve(process.cwd(), program.config));

} else {

    config = require(defaultConfig);

}

result = app(program.args[0], config);

if (result.length < 1) {

    console.log(clc.green('No errors :D'));

} else {

    console.log(clc.red(result));

}
