'use strict';

var F    = require('./file');
var P    = require('./predicate');
var R    = require('ramda');
var path = require('path');
var fs   = require('fs');

/**
 * RegExp a->[a]->[b]
 *
 * Returns an array of file paths that did not end with a
 * filename that matched the provided pattern.
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var matchPathErrors = R.curry(function(pattern, paths) {

    var fileNames  = paths.map(F.filename);
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

    var diff = R.intersection(files, F.filenames(paths));
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

    return R.difference(files, F.filenames(paths));

};

module.exports.missingFilenames = missingFilenames;

/**
 * []->[]->[]
 *
 * Takes a list of directory paths,
 * diffs their files against a provided array of strings
 * and returns the name of the files missing in the directory.
 *
 * @param requiredFiles
 * @param paths
 * @returns {*|Array}
 */
var missingDirFiles = function(requiredFiles, paths) {

    return paths.map(function(filepath) {

        var files        = fs.readdirSync(filepath);
        var missingFiles = R.difference(requiredFiles, files);

        return {directory: path.dirname(filepath), missing: missingFiles};

    });

};

module.exports.missingDirFiles = missingDirFiles;

/**
 * Layout {}->Config {}->[]
 * @param layout - A object structured like a directory tree
 * {
 *      foo/bar: {
 *
 *          files: ['file1', 'file2'],
 *          directories: {
 *
 *              foo/bar/baz: {...}
 *
 *          }
 *      }
 * }
 * @param config - A object with a directory rule structure
 * {
 *   files: ['file1', 'file2'],
 *   directories: {
 *
 *     foo/bar/baz: {...}
 *
 *   }
 * }
 */
var validateLayout = function(layout, config) {

    var filesConfig = config.files       || {};
    var dirConfig   = config.directories || {};
    var fileLayout  = layout.files       || {};
    var dirLayout   = Object.keys(layout.directories);
    // list of files each directory must have
    var requireAll  = (config.directories && config.directories.requireAll) ? config.directories.requireAll : [];

    // We validate the directories files
    var invalidFiles         = (filesConfig.pattern)  ? fileErrors(filesConfig.pattern, fileLayout)        : [];
    var missingRequiredFiles = (filesConfig.required) ? missingFilenames(filesConfig.required, fileLayout) : [];
    var requiredFiles        = (filesConfig.required) ? filenameMatches(filesConfig.required, fileLayout)  : [];
    var unMatchedFiles       = R.difference(invalidFiles, requiredFiles);

    // We validate the directories subdirectories
    var invalidDirs         = (dirConfig.pattern)  ? directoryErrors(dirConfig.pattern, dirLayout)   : [];
    var missingRequiredDirs = (dirConfig.required) ? missingFilenames(dirConfig.required, dirLayout) : [];
    var requiredDirs        = (dirConfig.required) ? filenameMatches(dirConfig.required, dirLayout)  : [];
    var unMatchedDirs       = R.difference(invalidDirs, requiredDirs);
    var missingDirFilePaths = (requireAll.length > 0) ? missingDirFiles(requireAll, dirLayout)       : [];

    return R.flatten([unMatchedFiles, missingRequiredFiles, unMatchedDirs, missingRequiredDirs, missingDirFilePaths]);

};

module.exports.validateLayout = validateLayout;