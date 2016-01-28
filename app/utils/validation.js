'use strict';

var Filter    = require('./filter');
var File      = require('./file');
var Predicate = require('./predicate');
var Ramda     = require('ramda');
var path      = require('path');
var fs        = require('fs');

/**
 * RegExp a->[]->[{path: b, error: b}]
 *
 * Returns an array of file paths that did not end with a
 * filename that matched the provided pattern.
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var matchPathErrors = Ramda.curry(function(pattern, paths) {

    var fileNames  = paths.map(File.filename);
    var validNames = fileNames.filter(Ramda.test(pattern));
    var valid      = paths.filter(Predicate.filenameMatchInPath(validNames));
    var invalid    = Ramda.difference(paths, valid);
    var result     = invalid.map(function(invalidPath) {

       return {

           path: invalidPath,
           error: File.filename(invalidPath) + ' does not match ' + pattern

       };

    });

    return result;

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

    var isFile = Ramda.compose(Predicate.isFile, Ramda.prop('path'));
    return matchPathErrors(pattern, paths).filter(isFile);

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

    var isDir = Ramda.compose(Predicate.isDirectory, Ramda.prop('path'));
    return matchPathErrors(pattern, paths).filter(isDir);

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

    var diff = Ramda.intersection(files, File.filenames(paths));
    return paths.filter(Predicate.filenameMatchInPath(diff)) ;

};

module.exports.filenameMatches = filenameMatches;

/**
 * [a]->b->[c]->[d]
 *
 * Takes an array of strings and an array of filepaths,
 * returns the difference between the strings and the
 * filenames of the paths.
 *
 * @param files   - String array
 * @param dirPath - path to directory with files
 * @param paths   - String array with file paths
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var missingFilenames = function(files, dirPath, paths) {

    var missing = Ramda.difference(files, File.filenames(paths));
    return missing.map(function(file) {

        return {

           path: dirPath,
           error: file + ' is missing in ' + File.filename(dirPath)

        };

    });

};

module.exports.missingFilenames = missingFilenames;

/**
 * []->[]->[]
 *
 * Takes a list of directory paths,
 * diffs their files against a provided array of strings
 * and returns a list of object with the path to the directory
 * that is missing files.
 *
 * @param requiredFiles
 * @param paths
 * @returns {*|Array}
 */
var missingDirFiles = function(requiredFiles, paths) {

    var result = [];
    paths.forEach(function(filepath) {

        var files        = fs.readdirSync(filepath);
        var missingFiles = Ramda.difference(requiredFiles, files);
        var error;

        if(missingFiles.length > 0) {

            error = {

                path: filepath,
                error: File.filename(filepath) + ' is missing ' + missingFiles

            };

            result.push(error);

        }

    });

    return result;

};

module.exports.missingDirFiles = missingDirFiles;

/**
 * Layout {}->Config {}->[]
 *
 * Validates that a file tree follows the rules
 * in the provided config object.
 *
 * If there are errors an array of objects will be returned
 * where each object describes what was wrong with a path
 * to the failure.
 *
 * If no errors are found it returns an empty array.
 *
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
 *
 * @returns An array
 */
var validateLayout = function(directoryPath, config) {

    if (!fs.existsSync(directoryPath)) return [];

    var layout               = File.directoryToObject(directoryPath);
    var filesConfig          = config.files       || {};
    var dirConfig            = config.directories || {};
    var requireAllConfig     = dirConfig.requireAll;
    var fileLayout           = layout.files       || {};
    var dirLayout            = Object.keys(layout.directories);
    // We validate the directories files
    var invalidFiles         = (filesConfig.pattern)  ? fileErrors(filesConfig.pattern, fileLayout) : [];
    var missingRequiredFiles = (filesConfig.required) ? missingFilenames(filesConfig.required, directoryPath, fileLayout) : [];
    var requiredFiles        = (filesConfig.required) ? filenameMatches(filesConfig.required, fileLayout) : [];
    var unMatchedFiles       = Filter.filterErrors(invalidFiles, requiredFiles);
    // We validate the directory subdirectories
    var invalidDirs          = (dirConfig.pattern)  ? directoryErrors(dirConfig.pattern, dirLayout) : [];
    var missingRequiredDirs  = (dirConfig.required) ? missingFilenames(dirConfig.required, directoryPath, dirLayout) : [];
    var requiredDirs         = (dirConfig.required) ? filenameMatches(dirConfig.required, dirLayout) : [];
    var unMatchedDirs        = Filter.filterErrors(invalidDirs, requiredDirs);
    var subdirErrors;

    if (dirLayout.length > 0 || requireAllConfig) {

        subdirErrors = dirLayout.map(function(subdir) {

            var requireAllErrors = [];
            var errors           = [];
            var subdirConfig     = dirConfig[path.basename(subdir)];

            if (requireAllConfig) {

                requireAllErrors = validateLayout(subdir, requireAllConfig);

            }

            if (subdirConfig) {

                errors = validateLayout(subdir, subdirConfig);

            }

            return errors.concat(requireAllErrors);

        });

    }

    subdirErrors = (subdirErrors) ? subdirErrors : [];
    return Ramda.flatten([unMatchedFiles, missingRequiredFiles, missingRequiredDirs, unMatchedDirs, subdirErrors]);

};

module.exports.validateLayout = validateLayout;