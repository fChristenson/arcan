var path = require('path');

module.exports = {
  CONFIG_FILE: '.arcan',

  DEFAULT: {
    root:       'web_modules',
    testFolder: '__tests__',

    structure: {
      action:    {},
      api:       {},
      app:       {},
      component: {folder: 'components'}
    }
  }
};
