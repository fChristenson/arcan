'use strict';

var U    = require('./utils');
var path = require('path');

module.exports = function(dirPath, config) {

    var errors = U.validateLayout(dirPath, config);

    return errors.reduce(function(str, obj) {

        str += obj.path + '\n';
        str += obj.error  + '\n\n';
        return str;

    }, '');


};