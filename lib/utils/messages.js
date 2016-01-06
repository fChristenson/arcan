module.exports = {
  BAD_MODULE_NAME: 'Error, the create command requires a moduleName after the command, like:\n$> arcan create myModule',
  BAD_ROOT:        'Error, could not find the project root. does your project have a package.json file or a .arcan config file?',
  BAD_CONFIG:      'Error, could not read the project configuration file\nis the .arcan file a valid JSON?',
  MODULE_EXISTS:   'Error, a module with the same name already exists',

  SUCCESS_CREATE:   'Success, module created',

  CONFIG_EXISTS:      'Error, your project already has a configuration file',
  BAD_MODULES:        'Error, could not detect che project modules',
  BAD_SYMLINKS:       'Error, could not detect existing symlinks',
  BAD_DIFF_SYMLINKS:  'Error, could not diff symlinks',
  BAD_FOLDER_PREP:    'Error, could not create the necessary node_modules folder',
  BAD_DELETE_SYMLINK: 'Error, could not delete symlink',
  BAD_ADD_SYMLINK:    'Error, could not add symlink',
  NOTHING_TO_DO:      'Nothing to do'
};
