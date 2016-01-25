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

    this.Given(/^The files? (.+) (are|is) in the directory$/, function (list, _, callback) {

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

    this.Given(/^There (is|are) (\d+) files? in the directory$/, function (_, num, callback) {

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
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^the subdirectories all have the files (.+)$/, function (list, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^there (are|is) (\d+) subdirector(ies|y)$/, function (num, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^(\d+) subdirector(ies|y) ha(ve|s) no files$/, function (num, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^that I have configured that directory (.+) should have the files? (.+)$/, function (name, list, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
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

};