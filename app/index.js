'use strict';

var U    = require('./utils');
var path = require('path');

module.exports = function(dirPath, config) {

    var layout = U.directoryToObject(dirPath);
    return U.validateLayout(layout, config);


};