var child_process = require('child_process');

/**
 * Constructs a Command Line Command object
 * @constructor
 */
var CliCommand = function (logger) {
    this._logger = logger;
    this._cmd = '';
    this._msg = '';
    this._options = {};
    this._callback = function () {};

    this._stdOut = [];
    this._stdErr = [];
};
CliCommand.prototype.exec = function (cmd) {
    if(typeof cmd === 'string') {
        this._cmd = cmd;
    }
    return this;
};
CliCommand.prototype.msg = function (msg) {
    if(typeof msg === 'string') {
        this._msg = msg;
    }
    return this;
};
CliCommand.prototype.options = function (options) {
    this._options = options;
    return this;
};
CliCommand.prototype.callback = function (callback) {
    if(typeof callback === 'function') {
        this._callback = callback;
    }
    return this;
};
CliCommand.prototype.start = function () {
    console.log(this._msg);

    var that = this;
    // execute the command
    var child = child_process.exec(this._cmd, this._options);

    // STDOUT
    //--------------------------------------------------------------------------
    child.stdout.on('error', function (err) {
        that._callback(err);
    });
    child.stdout.on('end', function () {
        that._callback(null);
    });
    // PROCESS SPAWNING
    //--------------------------------------------------------------------------
    child.on('error', function (err) {
        that._callback(err);
    });

    // set the logger
    if(this._logger && this._logger.child_process) {
        this._logger.child_process(child);
    }
};

module.exports = CliCommand;
