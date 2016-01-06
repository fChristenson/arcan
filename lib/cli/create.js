var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');

// UTILS
//--------------------------------------------------------------------------
var utils = {
  Logger: require('../utils/Logger.js')
};
var messages = require('../utils/messages.js');
// EXECS
//--------------------------------------------------------------------------
var exec = {
  findRoot:      require('../exec/findRoot.js'),
  projectConfig: require('../exec/projectConfig.js'),
  findModules:   require('../exec/findModules.js'),
  prepFolder:    require('../exec/prepFolder.js')
};

var types = {
  component: require('../types/component')
};

/**
 * This function will rlink
 * @returns {*}
 */
module.exports = function (module) {
  // Initialize a error logger that knows if it should act verbose
  this.logger = new utils.Logger(this.program.verbose);

  if (!module) {
    return this.logger.error(new Error(messages.BAD_MODULE_NAME));
  }

  // From where this command is executed, find the root folder
  var projectRoot = exec.findRoot();
  if (projectRoot instanceof Error) return this.logger.error(projectRoot);

  // Now detect the configuration of the project
  var config = exec.projectConfig(projectRoot);
  if (config instanceof Error) return this.logger.error(config);

  // Basic path information for the module
  var entries = types.component.make(module, config);
  if (entries instanceof Error) return this.logger.error(entries);

  if (this.program.dry) {
    // if we are on a dry run, just out put what we would do
    return entries.forEach(function (entry) {
      var finalPath = entry.type === 'dir' ? entry.path : path.join(entry.path, entry.name);
      this.logger.cmd('would make ' + entry.type, 'green', finalPath);
    }, this);
  }


  // TODO, maybe move into an EXEC
  // Actually do!
  // start with the folders
  entries.forEach(function (entry) {
    if (entry.type === 'dir') {
      mkdirp.sync(entry.path);
    }
  });
  // then do the files
  entries.forEach(function (entry) {
    if (entry.type === 'file') {
      var finalPath = path.join(entry.path, entry.name);
      fs.writeFileSync(finalPath, entry.content);
    }
  }, this);

  this.logger.cmd('Success', 'green', messages.SUCCESS_CREATE);
};
