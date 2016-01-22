'use strict';

var assert = require('assert');
require('../support/world');

module.exports = function() {

    this.Given(/^There is a directory$/, function (callback) {

        this.mkdir(this.dirPath);
        assert.ok(this.exist(this.dirPath));
        callback();

    });

    this.Given(/^There is a configuration$/, function (callback) {

        assert.ok(this.config);
        callback();

    });

};