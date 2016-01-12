'use strict';

/**
 * Turns a arguments object into an array
 *
 * @param args - Arguments object
 * @returns Array
 */
function argumentsToArray(args) {

    return Array.prototype.slice.call(args, 0);

}

module.exports.argumentsToArray = argumentsToArray;