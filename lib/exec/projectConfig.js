var fs = require('fs');
var path = require('path');
var messages = require('../utils/messages');

var CONF = require('../config.js');

/**
 * If a configuration file exists it merges with the basic CONF.PUBLIC
 *
 * @param configPath
 * @returns {*}
 */
function mergeConfig (configPath) {
    try {
        var configFile = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {};
        return Object.assign(CONF.DEFAULT, configFile);
    } catch (err) {
        return new Error(messages.BAD_CONFIG);
    }
}


/**
 * This function looks for a project configuration
 * otherwise it returns the basic configuration
 *
 * @param fromPath
 * @returns {*}
 */
function projectConfig (fromPath) {
    var currentPath = fromPath ? fromPath : process.cwd();
    var configPath = path.join(currentPath, CONF.CONFIG_FILE);
    return mergeConfig(configPath);
}


module.exports = projectConfig;
