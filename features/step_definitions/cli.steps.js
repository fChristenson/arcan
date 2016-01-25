'use strict';

var assert = require('assert');
require('../support/world');

module.exports = function () {

    this.After(function() {

        this.rmdir();

    });

    this.Given(/^I have set a file name pattern like (.+) in my configuration$/, function (name, callback) {

        this.config.files = {pattern: new RegExp(name)};
        callback();

    });

    this.Given(/^The files? (.+) (are|is) in the directory$/, function (list, _, callback) {

        this.mkfiles(list.split(','));
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

    this.Given(/^there (is|are) a? director(ies|y) named (.+)$/, function (list, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^(.+) has the files? (.+)$/, function (name, list, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^that I have configured that directory (.+) should only have files with names containing the word (.+)$/, function (name, word, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

};