'use strict';

var fs     = require('fs');
var path   = require('path');
var assert = require('chai').assert;
var U      = require('../');

describe('Util test', function() {

    var testDir = path.join(__dirname, 'test_directory');

    describe('readdirAbs', function() {

       it('should return the absolute paths to files in a dir', function(done) {

          var files = U.readdirAbs(testDir);
           assert.equal(fs.existsSync(files[0]), true); // should break if path is not abs
           done();

       });

    });

    describe('filesToObject', function() {

       it('returns a object with files and directories', function(done) {

           // check test_directory for the dir layout
           var result = U.filesToObject([testDir]);
           var keys = Object.keys(result.directories);
           var subdirectory = result.directories[keys[0]];

           assert.equal(result.files.length, 0); // no files provided
           assert.equal(keys.length, 1); // file provided is a dir
           assert.equal(subdirectory.files.length, 2); // 2 files in our subdir
           assert.equal(Object.keys(subdirectory.directories).length, 2); // 2 dir in subdir

           done();

       });

    });

    describe('directoryToObject', function() {

        it('returns a object with files and directories', function(done) {

            // check test_directory for the dir layout
            var result = U.directoryToObject(testDir);
            var keys = Object.keys(result.directories);
            var subdirectory1 = result.directories[keys[0]];
            var subdirectory2 = result.directories[keys[1]];

            assert.equal(result.files.length, 2);
            assert.equal(keys.length, 2); // 2 subdir in our dir

            assert.equal(subdirectory1.files.length, 2);
            assert.equal(Object.keys(subdirectory1.directories).length, 0);

            assert.equal(subdirectory2.files.length, 1);
            assert.equal(Object.keys(subdirectory2.directories).length, 1);

            done();

        });

    });

    describe('filenames', function() {

       it('should return the filename of a file path', function(done) {

           var paths  = ['foo/bar/baz', '/foo/bar', '/foo'];
           var result = U.filenames(paths);

           assert.equal(result[0], 'baz');
           assert.equal(result[1], 'bar');
           assert.equal(result[2], 'foo');
           done();

       })

    });

    describe('validateLayout', function() {

        it('should return empty array if config is empty', function(done) {

            var config = {};

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

       it('should return empty array if all files match the pattern', function(done) {

           var config = {

               files: {

                   pattern: /^test[0-9]/

               }

           };

           var result = U.validateLayout(testDir, config);
           assert.equal(result.length, 0);
           done();

       });

        it('should return empty array if files are matched by required', function(done) {

            var config = {

                files: {

                    required: ['test1', 'test2']

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

        it('should return empty array if all files are matched by either pattern or required files', function(done) {

            var config = {

                files: {

                    pattern: /^test1/,
                    required: ['test2']

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

        it('should return array if any file fails the pattern check', function(done) {

            var config = {

                files: {

                    pattern: /^fail/,
                    required: ['test2']

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 1);
            done();

        });

        it('should return array if a required file is missing', function(done) {

            var config = {

                files: {

                    required: ['fail']

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 1);
            done();

        });

        it('should return empty array if all directories match the provided pattern', function(done) {

            var config = {

                directories: {

                    pattern: /^dir[0-9]/

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

        it('should return array if any directory fail to match pattern', function(done) {

            var config = {

                directories: {

                    pattern: /^fail/

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 2);
            done();

        });

        it('should return empty array if all directories match required', function(done) {

            var config = {

                directories: {

                    required: ['dir1', 'dir2']

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

        it('should return array if any directory fail to match required', function(done) {

            var config = {

                directories: {

                    required: ['fail']

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 1);
            done();

        });

        it('should return empty array if all directories are matched by either pattern or required files', function(done) {

            var config = {

                directories: {

                    pattern: /^dir1/,
                    required: ['dir2']

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

        it('should return emtpy array if all directories follow the requireAll config', function(done) {

            var config = {

                directories: {

                    requireAll: {

                        files: {

                            pattern: /r/,
                            required: ['required']

                        }

                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

        it('should return array if any directory fail to follow the requireAll config', function(done) {

            var config = {

                directories: {

                    requireAll: {

                        files: {

                            pattern: /foo/,
                            required: ['bar']

                        },

                        directories: {

                            dir3: {

                                files: {

                                    pattern: /foo/,
                                    required: ['bar']

                                }

                            }
                        }

                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 7);
            done();

        });

        it('should return empty array if subdirectory files all match the provided pattern', function(done) {

            var config = {

                directories: {

                    dir1: {

                        files: {

                            pattern: /req/

                        }

                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

        it('should return array if subdirectory files do not all match the provided pattern', function(done) {

            var config = {

                directories: {

                    dir1: {

                        files: {

                            pattern: /fail/

                        }

                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 2);
            done();

        });

        it('should return empty array if subdirectory has provided required files', function(done) {

            var config = {

                directories: {

                    dir1: {

                        files: {

                            required: ['required']

                        }

                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

        it('should return array if subdirectory is missing provided required files', function(done) {

            var config = {

                directories: {

                    dir1: {

                        files: {

                            required: ['fail']

                        }

                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 1);
            done();

        });

        it('should return empty array if subdirectory covers all file configs', function(done) {

            var config = {

                directories: {

                    dir1: {

                        files: {

                            pattern: /^req/,
                            required: ['required']

                        }

                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

        it('should return empty array if subdirectory files all match the provided pattern', function(done) {

            var config = {

                directories: {

                    dir2: {

                        directories: {

                            dir3: {

                                files: {

                                    pattern: /nested/

                                }

                            }


                        }

                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

        it('should return array if subdirectory files do not all match the provided pattern', function(done) {

            var config = {

                directories: {

                    dir2: {

                        directories: {

                            dir3: {

                                files: {

                                    pattern: /fail/

                                }

                            }


                        }

                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 1);
            done();

        });

        it('should return empty array if subdirectory has provided required files', function(done) {

            var config = {

                directories: {

                    dir2: {

                        directories: {

                            dir3: {

                                files: {

                                    required: ['nested_required']

                                }

                            }


                        }

                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

        it('should return array if subdirectory is missing provided required files', function(done) {

            var config = {

                directories: {

                    dir2: {

                        directories: {

                            dir3: {

                                files: {

                                    required: ['fail']

                                }

                            }


                        }

                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 1);
            done();

        });

        it('should return an empty array if a config directory does not exist', function (done) {

            var config = {

                directories: {

                    fail: {},

                    dir1: {

                        directories: {

                            fail: {}

                        }
                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

        it('should return a array of objects that contain the path to the file error and a message', function(done) {

            var fileFails = {

                pattern: /fail/,
                required: ['fail']

            };

            var config = {

                files: fileFails,

                directories: {

                    dir1: {

                        files: fileFails

                    },

                    dir2: {

                        files: fileFails,

                        directories: {

                            dir3: {

                                files: fileFails

                            }


                        }

                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            result.forEach(function(error) {

                assert.equal(typeof error, 'object');
                assert.ok(error.path);
                assert.ok(error.error);

            });
            assert.equal(result.length, 10);
            done();

        });

        it('should not return errors for the . dir when a subdir rule has no matching dir', function (done) {

            var config = {

                directories: {

                    foo: {

                        files: {

                            required: ['barFile']

                        }

                    }

                }

            };

            var result = U.validateLayout(testDir, config);
            assert.equal(result.length, 0);
            done();

        });

    });

});