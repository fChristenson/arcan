'use strict';

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

    return fs.statSync(filePath).isFile();

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

    return fs.statSync(filePath).isDirectory();

};

module.exports.isDirectory = isDirectory;
