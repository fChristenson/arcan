# Arcan
## TM Architecture Analyzer

Arcan is project architecture analyzer, it is designed to allow
you to configure rules for how you want a project to be structured.
Filenames, required files and directories can be configured at all
levels of the project.

The goal of this project is to allow a architecture to remain
consistent over time.

## Usage

Arcan will by default look for `arcan.config.js` which is expected
to be a node modules exporting a config object.

```

module.exports = {

    // the files property contains all normal file configurations

    files: {

        pattern: /my_file/,             // Arcan will report any files that do not match the provided pattern
        required: ['important_file']    // Arcan will report if the directory does not contain the required file

    },

    directories: {

        requireAll: ['important_file'], // Arcan will report any subdirectory that does not contain the required files
        foo: {                          // here we can set what subdirectories we want to configure rules for

            files: {...},
            directories: {...}

        }

    }

};

```

Arcan will ignore any subdirectories that do not contain any rules.
All configurations are optional.
