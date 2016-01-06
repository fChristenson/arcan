var clc = require('cli-color');

function logData(data) {
    console.log(clc.cyan('[arcan Log] ') + data.toString().replace(/\n/g, '\n' + clc.cyan('[arcan] ')));
}

function logError(err) {
    console.log(clc.red('[arcan Err] ') + err.replace(/\n/g, '\n' + clc.red('[arcan Err] ')));
}

function logWarn(err) {
    console.log(clc.yellow('[arcan Warn] ') + err.replace(/\n/g, '\n' + clc.yellow('[arcan Warn] ')));
}

function logCmd(cmd, clr, err) {
    console.log(clc[clr]('[arcan ' + cmd + '] ') + err.replace(/\n/g, '\n' + clc[clr]('[arcan ' + cmd + '] ')));
}

function Logger(isVerbose) {
    this._isVerbose = isVerbose || false;
}

Logger.prototype.child_process = function (child) {

    function removeListeners() {
        child.stdout.removeListener('data', logData);
        child.stderr.removeListener('data', logData);
        child.stdout.removeListener('end', removeListeners);
        child.removeListener('error', logError);
    }

    if (this._isVerbose) {
        child.stdout.on('data', logData);
        child.stderr.on('data', logData);
        child.on('error', logError);
        child.stdout.on('end', removeListeners);
    }

};


Logger.prototype.error = function (error) {
    if (this._isVerbose) {
        logError(error.stack);
    }
    else {
        logError(error.message);
    }
};

Logger.prototype.log = function (msg) {
    logData(msg);
};

Logger.prototype.cmd = function (cmd, clr, msg) {
    logCmd(cmd, clr, msg);
};

Logger.prototype.warn = function (msg) {
    logWarn(msg);
};

module.exports = Logger;
