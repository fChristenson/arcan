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


// VLIDATOR VARIABLE
var validator = require('../utils/validator.js');


// VALIDATE ROOTS
var rootPaths = {
    // has a valid package.json or a .rlink file
    good: path.join(__dirname, 'env', 'roots', 'good'),
    // one that does not have the above
    bad: path.join(__dirname, 'env', 'roots', 'bad')
};



describe("Validator", function () {

    it("should validate good roots", function () {
        var goodRoots = fs.readdirSync(rootPaths.good);
        goodRoots.forEach(function (root) {
            var rootPath = path.join(rootPaths.good, root);
            expect(validator.isProjectRoot(rootPath)).to.be.equal(true);
        });
    });

    it("should reject bad roots", function () {
        var goodRoots = fs.readdirSync(rootPaths.bad);
        goodRoots.forEach(function (root) {
            var rootPath = path.join(rootPaths.bad, root);
            expect(validator.isProjectRoot(rootPath)).to.be.equal(false);
        });
    });

    it("should validate good folders", function () {
        expect(validator.isFolder(rootPaths.good)).to.be.equal(true);
    });

    it("should ignore node_modules folders", function () {
        var nodeModulesPath = path.join(__dirname, 'node_modules');
        expect(validator.isFolder(nodeModulesPath)).to.be.equal(false);
    });

    it("should ignore files", function () {
        var pathFoFile = path.join(rootPaths.good, '1', 'package.json');
        expect(validator.isFolder(pathFoFile)).to.be.equal(false);
    });
});