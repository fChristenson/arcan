'use strict';

var P    = require('./predicate');
var R    = require('ramda');
var path = require('path');

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
 */
var filename = function(filepath) {

    return path.basename(filepath);

};

module.exports.filename = filename;

/**
 * Returns an array of strings that did not match the
 * provided pattern.
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var matchPathErrors = R.curry(function(pattern, paths) {

    var fileNames  = paths.map(filename);
    var validNames = fileNames.filter(R.test(pattern));
    var valid      = paths.filter(P.filenameMatchInPath(validNames));

    return R.difference(paths, valid);

});

module.exports.matchPathErrors = matchPathErrors;

/**
 * RegExp a->[b]->[c]
 *
 * Returns an array of all paths that leads to a file
 * that does not have a name that matches the provided
 * pattern.
 *
 * @param pattern - RegExp to match
 * @param paths   - Array of file paths
 * @returns Array with paths that failed match
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var fileErrors = function(pattern, paths) {

  return matchPathErrors(pattern, paths).filter(P.isFile);

};

module.exports.fileErrors = fileErrors;

/**
 * RegExp a->[b]->[c]
 *
 * Returns an array of all paths that lead to a directory
 * with a name that does not match the provided pattern.
 *
 * @param pattern - RegExp to match
 * @param paths   - Array of file paths
 * @returns Array with paths that failed match
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var directoryErrors = function(pattern, paths) {

    return matchPathErrors(pattern, paths).filter(P.isDirectory);

};

module.exports.directoryErrors = directoryErrors;

/**
 * [a]->[b]->[c]
 *
 * Takes an array of strings and an array of filepaths,
 * returns the intersection between the strings and the
 * filenames of the paths.
 *
 * @param files - String array
 * @param paths - String array with file paths
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var filenameMatches = function(files, paths) {

    var diff = R.intersection(files, filenames(paths));
    return paths.filter(P.filenameMatchInPath(diff)) ;

};

module.exports.filenameMatches = filenameMatches;

/**
 * [a]->[b]->[c]
 *
 * Takes an array of strings and an array of filepaths,
 * returns the difference between the strings and the
 * filenames of the paths.
 *
 * @param files - String array
 * @param paths - String array with file paths
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var missingFilenames = function(files, paths) {

    var diff = R.difference(files, filenames(paths));
    return paths.filter(P.filenameMatchInPath(diff)) ;

};

module.exports.missingFilenames = missingFilenames;

var validateLayout = function(layout, config) {

    var filesConfig = config.files       || {};
    var dirConfig   = config.directories || {};
    var fileLayout  = layout.files       || {};
    var dirLayout   = Object.keys(layout.directories);

    // We validate the directories files
    var invalidFiles         = (filesConfig.pattern)  ? fileErrors(filesConfig.pattern, fileLayout)        : [];
    var missingRequiredFiles = (filesConfig.required) ? missingFilenames(filesConfig.required, fileLayout) : [];
    var requiredFiles        = (filesConfig.required) ? filenameMatches(filesConfig.required, fileLayout)  : [];
    var unMatchedFiles       = R.difference(invalidFiles, requiredFiles);

    // We validate the directories subdirectories
    var invalidDirs          = (dirConfig.pattern)  ? directoryErrors(dirConfig.pattern, dirLayout)   : [];
    var missingRequiredDirs  = (dirConfig.required) ? missingFilenames(dirConfig.required, dirLayout) : [];
    var requiredDirs         = (dirConfig.required) ? filenameMatches(dirConfig.required, dirLayout)  : [];
    var unMatchedDirs        = R.difference(invalidDirs, requiredDirs);

    return R.flatten([unMatchedFiles, missingRequiredFiles, unMatchedDirs, missingRequiredDirs]);

};

module.exports.validateLayout = validateLayout;