'use strict';

var R    = require('ramda');
var path = require('path');

/**
 * Returns an array of strings that did not match the
 * provided pattern.
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var matchErrors = R.curry(function(pattern, array) {

    var valid = array.filter(R.test(pattern));
    return R.difference(array, valid);

});

module.exports.matchErrors = matchErrors;

/**
 * Returns the filenames of an array of paths
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var filenames = R.map(path.basename);

module.exports.filenames = filenames;

/**
 * Returns an array of all paths that has a filename
 * that does not match the provided pattern.
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var fileErrors = R.curry(function(pattern, files) {

    var result = R.compose(matchErrors(pattern), filenames);
    return result(files);

});

module.exports.fileErrors = fileErrors;

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

    return R.intersection(files, filenames(paths));

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

    return R.difference(files, filenames(paths));

};

module.exports.missingFilenames = missingFilenames;

var validateLayout = function(layout, config) {

    var filesConfig       = config.files || {};
    var directoriesConfig = config.directories  || {};
    var layoutFiles       = layout.files  || {};
    var layoutDirectories = layout.directories  || {};

    // We validate the directories files
    var invalidFiles         = (filesConfig.pattern)  ? fileErrors(filesConfig.pattern, layoutFiles) : [];
    var missingRequiredFiles = (filesConfig.required) ? missingFilenames(filesConfig.required, layoutFiles) : [];
    var requiredFiles        = (filesConfig.required) ? filenameMatches(filesConfig.required, layoutFiles) : [];
    var unMatchedFiles       = R.difference(invalidFiles, requiredFiles);

    return unMatchedFiles.concat(missingRequiredFiles);

};

module.exports.validateLayout = validateLayout;