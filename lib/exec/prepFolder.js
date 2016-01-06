var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports =  function (opts) {
    console.error('TODO, PREP FOLDER')
    if(!opts || !opts.root || !opts.config) {
        return false;
    }
    try {
        // /projectPath/node_modules
        var corePath = path.join(opts.root, opts.config.symlinkTo);

        if(!fs.existsSync(corePath)) {
            mkdirp.sync(corePath);
        }
        return true;
    } catch (e) {
        return false;
    }

};
