'use strict';

var path = require('path');
var R    = require('ramda');
var fs   = require('fs');

/**
 * Filepath a->Boolean
 *
 * Returns true if provided file is a
 * file.
 *
 * @param filePath - path to file
 * @returns Boolean
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
function isFile(filePath) {

    if (fs.existsSync(filePath)) {

        return fs.statSync(filePath).isFile();

    }

    return false;

};

module.exports.isFile = isFile;

/**
 * Filepath a->Boolean
 *
 * Returns true if provided file is a
 * directory.
 *
 * @param filePath - name of file
 * @returns Boolean
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
function isDirectory(filePath) {

    if(fs.existsSync(filePath)) {

        return fs.statSync(filePath).isDirectory();

    }

    return false;

};

module.exports.isDirectory = isDirectory;

var filenameMatchInPath = function(filenames) {

    return function(filePath) {

        var fileName    = path.basename(filePath);
        var match       = R.find(R.equals(fileName), filenames);

        return !!match;

    };

};

module.exports.filenameMatchInPath = filenameMatchInPath;