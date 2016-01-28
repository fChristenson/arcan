'use strict';

var path   = require('path');
var assert = require('assert');

require('../support/world');

module.exports = function () {

    this.After(function() {

        this.rmdir(this.dirPath);

    });

    this.Given(/^I have set a file name pattern like (.+) in my configuration$/, function (name, callback) {

        this.config.files = {pattern: new RegExp(name)};
        callback();

    });

    this.Given(/^the files? (.+) (are|is) in the directory$/, function (list, _, callback) {

        var paths = list.split(',').map(function(name) {

            return path.join(this.dirPath, name);

        }.bind(this));

        this.mkfiles(paths);
        callback();

    });

    this.When(/^I run the program$/, function (callback) {

        this.runProgram();
        callback();

    });

    this.Given(/^there (is|are) (\d+) files? in the directory$/, function (_, num, callback) {

        var len = this.readdir(this.dirPath).length;
        assert.equal(num, len);
        callback();

    });

    this.Then(/^I should see (\d+) errors?$/, function (num, callback) {

        assert.equal(this.errors.length, parseInt(num));
        callback();

    });

    this.Given(/^I have set a list of required file names like (.+)$/, function (list, callback) {

        this.config.files = {required: list.split(',')};
        callback();

    });

    this.Given(/^that I have configured that all directories should have the files (.+)$/, function (list, callback) {

        this.config = {

            directories: {

                requireAll: list.split(',')

            }

        };

        callback();

    });

    this.Given(/^the subdirectories all have the files? (.+)$/, function (list, callback) {

        this.randomSubdirs.forEach(function(dir) {

            var paths = list.split(',').map(function (name) {

                return path.join(dir, name);

            });

           this.mkfiles(paths);

        }.bind(this));

        callback();

    });

    this.Given(/^there (are|is) (\d+) subdirector(ies|y)$/, function (_, num, _2, callback) {

        var dir;
        var i;

        for(i = 0; i < num; i++) {

            dir = path.join(this.dirPath, 'foo' + i);
            this.mkdir(dir);
            this.randomSubdirs.push(dir);

        }

        callback();

    });

    this.Given(/^(\d+) subdirector(ies|y) ha(ve|s) (\d+) files?$/, function (num, _, _2, expectedNumFiles, callback) {

        var that      = this;
        var actualNum = this.randomSubdirs.reduce(function(count, dir) {

            var numFiles = that.readdir(dir).length;
            return (numFiles === parseInt(expectedNumFiles)) ? ++count : count;

        }, 0);

        assert.equal(actualNum, parseInt(num));
        callback();

    });

    this.Given(/^that I have configured that directory (.+) should have the files? (.+)$/, function (name, list, callback) {

        this.config = {

            directories: {}

        };
        this.config.directories[name] = {

            files: {required: list.split(',')}

        };

        callback();

    });

    this.Given(/^there (is|are) a? director(ies|y) named (.+)$/, function (_, _2, list, callback) {

        list.split(',').forEach(function(dir) {

           this.mkdir(path.join(this.dirPath, dir));

        }.bind(this));

        callback();

    });

    this.Given(/^(.+) has the files? (.+)$/, function (name, list, callback) {

        var dirPath = path.join(this.dirPath, name);
        var filePaths = list.split(',').map(function (file) {

            return path.join(dirPath, file);

        });

        this.mkfiles(filePaths);
        callback();

    });

    this.Given(/^that I have configured that directory (.+) should only have files with names containing the word (.+)$/, function (name, word, callback) {

        this.config.directories = {};
        this.config.directories[name] = {

            files: {
                pattern: new RegExp(word)
            }

        };

        callback();

    });

    this.Given(/^that I have configured that all directories should have a shared configuration$/, function (callback) {

        this.config.directories = {};
        this.config.directories.requireAll = {};
        callback();

    });

    this.Given(/^in my shared configuration I have set a file name pattern like (.+)$/, function (pattern, callback) {

        if(this.config.directories.requireAll.files) {

            this.config.directories.requireAll.files.pattern = new RegExp(pattern);

        } else {

            this.config.directories.requireAll.files = {
                pattern: new RegExp(pattern)
            };

        }

        callback();

    });

    this.Given(/^in my shared configuration I have set a list of required file names like (.+)$/, function (list, callback) {

        if(this.config.directories.requireAll.files) {

            this.config.directories.requireAll.files.required = list.split(',');

        } else {

            this.config.directories.requireAll.files = {
                required: list.split(',')
            };

        }

        callback();

    });

};