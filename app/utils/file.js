'use strict';

var L    = require('./log');
var R    = require('ramda');
var P    = require('./predicate');
var fs   = require('fs');
var path = require('path');

/**
 * Takes an array of file paths and returns
 * a object with the structure of the files
 * and possible directories.
 *
 * @param filePaths - array with file paths
 * @returns {{}}
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var filesToObject = function(filePaths) {

    var subdirectories = filePaths.filter(P.isDirectory);
    var result         = {};
    result.files       = filePaths.filter(P.isFile);
    result.directories = {};

    if (subdirectories.length > 0) {

        subdirectories.forEach(function(dir) {

            result.directories[dir] = directoryToObject(dir);

        });

    }

    return result;

};

module.exports.filesToObject = filesToObject;

/**
 * a->[b]
 *
 * Takes a directory path and returns
 * the absolue path to each file in the
 * directory.
 *
 * @param dirPath - path to directory
 * @returns {*|Array}
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var readdirAbs = function(dirPath) {

    if (fs.existsSync(dirPath)) {

        var files = fs.readdirSync(dirPath);
        return files.map(function(file) {

            return path.join(dirPath, file);

        });

    }

    return [];

};

module.exports.readdirAbs = readdirAbs;

/**
 * Takes a root directory and returns a
 * json object with the directory layout.
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var directoryToObject = R.compose(filesToObject, readdirAbs);

module.exports.directoryToObject = directoryToObject;

/**
 * Returns the filenames of an array of paths
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var filenames = R.map(path.basename);

module.exports.filenames = filenames;

/**
 * String a->b
 *
 * Returns the filename of the provided path.
 *
 * @param filepath - path to file
 * @returns String
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var filename = function(filepath) {

    return path.basename(filepath);

};

module.exports.filename = filename;