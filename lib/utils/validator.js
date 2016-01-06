var fs = require('fs');
var path = require('path');

var CONF = require('../config.js');

module.exports = {
  /**
   * This function checks if a folder is a valid project root.
   * A NodeJs root is a folder which has a .arcan file
   * A NodeJs root is a folder which has a package.json
   *
   * @param {!string} currentPath
   * @return {boolean}
   */
  isProjectRoot: function (currentPath) {
    var configPath = path.join(currentPath, CONF.CONFIG_FILE);
    var pckgJsonPath = path.join(currentPath, 'package.json');
    try {
      return fs.existsSync(configPath) || fs.existsSync(pckgJsonPath);
    }
    catch (e) {
      return false;
    }
  }
};
