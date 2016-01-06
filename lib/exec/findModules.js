var fs = require('fs');
var path = require('path');

var validator = require('../utils/validator.js');

module.exports =  function (opts) {
    if(!opts || !opts.root || !opts.config) {
        return false;
    }
    try {

        // /projectPath/scripts/core
        var corePath = path.join(opts.root, opts.config.root);

        var result = {};

        // read the folder
        var folderElements = fs.readdirSync(corePath);

        // isolate the folders from loose files
        var folders = folderElements.filter(function (folderElement) {
            return validator.isFolder(path.join(corePath, folderElement));
        });

        // create an array of all values in an object
        var aliasKeys = Object.keys(opts.config.alias);
        var aliasFolders = aliasKeys.map(function (key) {return opts.config.alias[key]});

        // for each baseFolder (like dispatcher) put it into the results
        folders.forEach(function (folder) {
            var folderAlias = aliasFolders.indexOf(folder);
            // check if this module is aliased
            var moduleKey = folderAlias === -1 ? folder : aliasKeys[folderAlias];
            // set aside the module's path
            result[opts.config.prefix + moduleKey] = fs.realpathSync(path.join(corePath, folder));
        });

        return result
    } catch (e) {
        return false;
    }

};
