var path = require('path');
var validator = require('../utils/validator.js');
var messages = require('../utils/messages');

/**
 *
 * This function crawls up the folder tree looking for a valid root folder
 * @param {string=} fromPath
 * @return {string|Error}
 *
 */
module.exports = function findRoot (fromPath) {
  var currentPath = fromPath ? fromPath : process.cwd();
  var foundRoot = false;
  var safeCount = 1000; // safety net for the while loop

  while (!foundRoot && currentPath !== '/' && safeCount) {
    if (validator.isProjectRoot(currentPath)) {
      foundRoot = true;
    } else {
      currentPath = path.dirname(currentPath);
    }
    --safeCount;
  }
  return foundRoot ? currentPath : new Error(messages.BAD_ROOT);
};
