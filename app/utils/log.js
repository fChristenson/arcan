'use strict';

var R = require('ramda');

/**
 * a->b->b
 *
 * Logs a label and value to console
 *
 * @param label - Any value
 * @param value - Any value
 * @returns Value
 */
var log = function(label, value) {

    console.log(label, value);
    return value;
}

module.exports.log = R.curry(log);