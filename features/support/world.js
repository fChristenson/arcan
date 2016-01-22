'use strict';

var path = require('path');
var app  = require('../../app');
var U    = require('../../app/utils');
var fs   = require('fs');

function World() {

    this.errors = [];
    this.config  = {};
    this.dirPath = '.tmp_test';

    this.clearDir = function () {

        var files = this.readdir(this.dirPath);
        files.forEach(function (file) {

            fs.unlinkSync(path.join(this.dirPath, file));

        }.bind(this));

    };

    this.runProgram = function () {

        var errorStr = app(this.dirPath, this.config);
        this.errors = errorStr ? errorStr.split('\n') : [];
        this.errors = this.errors.filter(function(str) {

            return /^\.tmp_test/.test(str);

        });
        return errorStr;

    };

    this.mkfiles = function (list) {

        list.forEach(function (file) {

            fs.writeFileSync(path.join(this.dirPath, file), file);

        }.bind(this));

    };

    this.readdir = function (path) {

        if (!this.exist(path)) {

            return [];

        }

        return fs.readdirSync(path);

    };

    this.readdirFiles = function (path) {

        if (!this.exist(path)) {

            return [];

        }

        return fs.readdirSync(path).filter(U.isFile);

    };

    this.exist   = function(path) {

        return fs.existsSync(path);

    };

    this.mkdir   = function(path) {

        if (this.exist(path)) {

            return path;

        }

        return fs.mkdirSync(path);

    };


}

module.exports = function () {

    this.World = World;

};