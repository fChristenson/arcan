var failFileConfig = {

    pattern: /foo/,
    required: ['barFile']

};

var failDirConfig = {

    requireAll: ['bazFile'],
    pattern: /foo/,
    required: ['barDir'],
    baz: {

        files: failFileConfig

    }

};

module.exports = {

    files: failFileConfig,

    directories: failDirConfig

};