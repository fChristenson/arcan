'use strict';

var path = require('path');
var app  = require('../../app');
var U    = require('../../app/utils');
var fs   = require('fs');

function World() {

    this.errors = [];
    this.config  = {};
    this.dirPath = 'tmp_test';
    var that = this;

    this.rmdir = function rmdir(dirPath) {

        var files = that.readdir(dirPath);

        files.forEach(function (file) {

            var filePath = path.join(dirPath, file);
            var stat     = fs.statSync(filePath);

            if (stat.isDirectory()) {

                rmdir(filePath);

            } else {

                fs.unlinkSync(filePath);

            }

        });

        fs.rmdirSync(dirPath);

    };

    this.runProgram = function () {

        var errorStr = app(this.dirPath, this.config);
        this.errors = errorStr ? errorStr.split('\n') : [];
        this.errors = this.errors.filter(function(str) {

            return /^tmp_test/.test(str);

        });
        return errorStr;

    };

    this.mkfiles = function (list) {

        list.forEach(function (filePath) {

            fs.writeFileSync(filePath, 'foo');

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