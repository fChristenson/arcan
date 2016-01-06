// Chai test library
var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);

// assign chai verbs for more readable tests
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

// START TEST
//-----------------------------------------------------------
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');


// RLINK VARIABLE
var rlink = require('../../index.js');
// use this to test error messages
var messages = require('../utils/messages.js');

// PATHS
//-----------------------------------------------------------
var paths = {
    env: path.join(__dirname, 'env'),
    // has a valid package.json or a .rlink file
    good: path.join(__dirname, 'env', 'roots', 'good'),
    // one that does not have the above
    bad: path.join(__dirname, 'env', 'roots', 'bad')
};

paths.rlink = path.join(paths.env, '.rlink');
paths.node_modules = path.join(paths.env, 'node_modules');
paths.test = path.join(paths.env, 'test');
paths.test_node_modules = path.join(paths.test, 'node_modules');

// used to reset
var cl = console.log;
var ce = console.error;

// When spying on consoles, remember to reset them
function resetConsoles () {
    console.log = cl;
    console.error = ce;
}

function cleanTestFolders () {
    if(fs.existsSync(paths.rlink)) {
        fs.unlinkSync(paths.rlink);
    }

    if(fs.existsSync(paths.node_modules)) {
        rimraf.sync(paths.node_modules);
    }

    if(fs.existsSync(paths.test)) {
        rimraf.sync(paths.test);
    }
}

describe("Rlink Config", function () {

    // after each, clean the .rlink config
    afterEach(function () {
        cleanTestFolders();
    });

    it("test rlink in wrong root", function () {
        var log = chai.spy();
        console.log = log;

        rlink.run({});

        // reset before asserting
        resetConsoles();

        log.should.have.been.called.with(messages.BAD_ROOT_SUGGESTION);
        log.should.have.been.called.with(messages.BAD_ROOT);
    });

    it("test rlink with malformed config", function () {
        var cwd = path.join(__dirname, 'env');
        fs.writeFileSync(path.join(cwd, '.rlink'), 'test');

        var log = chai.spy();
        console.log = log;

        rlink.run({
            cwd: paths.env
        });

        // reset before asserting
        resetConsoles();

        log.should.have.been.called.with(messages.BAD_CONFIG);
    });

    it("test rlink with well formed but useless config", function () {
        var cwd = path.join(__dirname, 'env');
        fs.writeFileSync(path.join(cwd, '.rlink'), '{}');

        var log = chai.spy();
        console.log = log;

        rlink.run({
            cwd: paths.env
        });

        // reset before asserting
        resetConsoles();

        log.should.have.been.called.not.with(messages.BAD_CONFIG);
        log.should.have.been.called.with(messages.BAD_MODULES);
    });

    it("test rlink with good base config", function () {
        var cwd = path.join(__dirname, 'env');

        var config = {
            root:  'modules'
        };

        fs.writeFileSync(path.join(cwd, '.rlink'), JSON.stringify(config));

        var log = chai.spy();
        console.log = log;

        rlink.run({
            cwd: paths.env
        });

        // reset before asserting
        resetConsoles();

        // check the symlinks created
        var expectedLinks = ['tm-apps', 'tm-components', 'tm-dispatcher', 'tm-main', 'tm-utils'];
        expect(fs.readdirSync(paths.node_modules)).to.deep.equal(expectedLinks);

        // check the logs
        log.should.have.been.called.not.with(messages.BAD_CONFIG);
        log.should.have.been.called.not.with(messages.BAD_MODULES);
        log.should.have.been.called(expectedLinks.length);
    });


});


function checkSymlink (name, pathTo, nodeModulesPath) {
    nodeModulesPath = nodeModulesPath || paths.node_modules;
    var actualPath = path.join(__dirname, 'env', pathTo);
    var linkPath = path.join(nodeModulesPath, name);

    return fs.readlinkSync(linkPath) === actualPath;
}

describe("Rlink results", function () {

    // after each, clean the .rlink config
    afterEach(function () {
        cleanTestFolders();
    });


    it("test rlink top level", function () {
                var cwd = path.join(__dirname, 'env');

        var config = {
            root:  'modules'
        };

        fs.writeFileSync(path.join(cwd, '.rlink'), JSON.stringify(config));

        var log = chai.spy();
        console.log = log;

        rlink.run({
            cwd: paths.env
        });

        // reset before asserting
        resetConsoles();

        // check the symlinks created
        var expectedLinks = ['tm-apps', 'tm-components', 'tm-dispatcher', 'tm-main', 'tm-utils'];
        expect(fs.readdirSync(paths.node_modules)).to.deep.equal(expectedLinks);

        // check the symlinks point to the right folders
        expect(checkSymlink('tm-apps', 'modules/apps'));
        expect(checkSymlink('tm-components', 'modules/components'));
        expect(checkSymlink('tm-dispatcher', 'modules/dispatcher'));
        expect(checkSymlink('tm-main', 'modules/main'));
        expect(checkSymlink('tm-utils', 'modules/utils'));

        // check logs are ok
        log.should.have.been.called.not.with(messages.BAD_CONFIG);
        log.should.have.been.called.not.with(messages.BAD_MODULES);
        log.should.have.been.called(expectedLinks.length);

    });


    it("test rlink with aliases", function () {
        var cwd = path.join(__dirname, 'env');

        var config = {
            root:  'modules',
            alias: {
                app: 'apps',
                cmp: 'components'
            }
        };

        fs.writeFileSync(path.join(cwd, '.rlink'), JSON.stringify(config));

        var log = chai.spy();
        console.log = log;

        rlink.run({
            cwd: paths.env
        });

        // reset before asserting
        resetConsoles();

        // check the symlinks created
        var expectedLinks = ['tm-app', 'tm-cmp', 'tm-dispatcher', 'tm-main', 'tm-utils'];
        expect(fs.readdirSync(paths.node_modules)).to.deep.equal(expectedLinks);

        // check the symlinks point to the right folders
        expect(checkSymlink('tm-app', 'modules/apps'));
        expect(checkSymlink('tm-cmp', 'modules/components'));
        expect(checkSymlink('tm-dispatcher', 'modules/dispatcher'));
        expect(checkSymlink('tm-main', 'modules/main'));
        expect(checkSymlink('tm-utils', 'modules/utils'));

        // check the logs
        log.should.have.been.called.not.with(messages.BAD_CONFIG);
        log.should.have.been.called.not.with(messages.BAD_MODULES);
        log.should.have.been.called(expectedLinks.length);
    });

    it("test rlink in a different symlink location", function () {
        var cwd = path.join(__dirname, 'env');

        var config = {
            root:  'modules',
            symlinkTo:  'test/node_modules'
        };

        fs.writeFileSync(path.join(cwd, '.rlink'), JSON.stringify(config));

        var log = chai.spy();
        console.log = log;

        rlink.run({
            cwd: paths.env
        });

        // reset before asserting
        resetConsoles();

        // check the symlinks created
        var expectedLinks = ['tm-apps', 'tm-components', 'tm-dispatcher', 'tm-main', 'tm-utils'];
        expect(fs.readdirSync(paths.test_node_modules)).to.deep.equal(expectedLinks);

        // check the symlinks point to the right folders
        expect(checkSymlink('tm-apps', 'modules/apps', paths.test_node_modules));
        expect(checkSymlink('tm-components', 'modules/components', paths.test_node_modules));
        expect(checkSymlink('tm-dispatcher', 'modules/dispatcher', paths.test_node_modules));
        expect(checkSymlink('tm-main', 'modules/main', paths.test_node_modules));
        expect(checkSymlink('tm-utils', 'modules/utils', paths.test_node_modules));

        // check the logs
        log.should.have.been.called.not.with(messages.BAD_CONFIG);
        log.should.have.been.called.not.with(messages.BAD_MODULES);
        log.should.have.been.called(expectedLinks.length);
    });


    it("test rlink --dry option", function () {
        var cwd = path.join(__dirname, 'env');

        var config = {
            root:  'modules',
            symlinkTo:  'test/node_modules'
        };

        fs.writeFileSync(path.join(cwd, '.rlink'), JSON.stringify(config));

        var log = chai.spy();
        console.log = log;

        rlink.run({
            dry: true,
            cwd: paths.env
        });

        // reset before asserting
        resetConsoles();

        // check the symlinks created
        var expectedLinks = ['tm-apps', 'tm-components', 'tm-dispatcher', 'tm-main', 'tm-utils'];
        expect(fs.existsSync(paths.test_node_modules)).to.equal(false);

        // check the logs
        log.should.have.been.called.not.with(messages.BAD_CONFIG);
        log.should.have.been.called.not.with(messages.BAD_MODULES);
        log.should.have.been.called(expectedLinks.length);
    });


});

