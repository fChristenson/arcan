//var init = require('./lib/cli/init.js');
var run = require('./lib/cli/run.js');

module.exports = {
    /**
     * This function runs the rlink command, executable from a NodeJs script
     * @param opts
     */
    run: function (opts) {
        opts = opts || {};
        run.call({
            verbose: opts.verbose || undefined,
            dry: opts.dry || undefined,
            watch: opts.watch || undefined
        });
    }
};
