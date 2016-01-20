'use strict';

var R = require('ramda');

/**
 * []->[]->[]
 *
 * Filters an array of errors,
 * removing any error that has a
 * path that matches any of the provided
 * paths.
 *
 * @param errors - array of validation error objects
 * @param paths  - array if file paths
 * @returns Array of objects
 *
 * @author Fredrik Christenson <fredrik.christenson@ticnet.se>
 */
var filterErrors = function (errors, paths) {

    var invalid = R.difference(R.map(R.prop('path'), errors), paths);
    return errors.filter(function (error) {

        return invalid.indexOf(error.path) !== -1;

    });

};

module.exports.filterErrors = filterErrors;