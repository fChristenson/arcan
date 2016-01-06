var path = require('path');
var fs = require('fs');

var messages = require('../utils/messages');

//TODO
module.exports = {
  /**
   *
   */
  validate: function () {

  },

  make: function (moduleName, config) {

    var testFileName = moduleName + '_spec.js';// TODO, configure?
    var componentFileName = 'index.jsx';// TODO, configure?
    var scssFileName = 'index.scss';// TODO, configure?

    var basePath = path.join(config.root, config.structure.component.folder);
    var modulePath = path.join(basePath, moduleName);

    var testFolderPath = path.join(modulePath, config.testFolder);

    if (fs.existsSync(modulePath)) {
      return new Error(messages.MODULE_EXISTS);
    }

    // return the array of files to create
    return [
      { // test folder
        type: 'dir',
        name: config.testFolder,
        path: testFolderPath
      },

      { // empty test
        type:    'file',
        name:    testFileName,
        path:    testFolderPath,
        content: '// TODO\n throw new Error(\'Write your tests!\')'
      },

      { // empty component
        type:    'file',
        name:    componentFileName,
        path:    modulePath,
        content: '// TODO\n throw new Error(\'Write your component\')'
      },

      { // empty scss
        type:    'file',
        name:    scssFileName,
        path:    modulePath,
        content: '// TODO\n throw new Error(\'Write your component\')'
      }
    ];
  }
};
