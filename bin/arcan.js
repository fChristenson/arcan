#!/usr/bin/env node

// CLI Commander module
var program = require('commander');

// scope for the commands
var scope = {program: program};

// valid commands
var commands = {
  create: require('../lib/cli/create.js')
};


// set the default version and options
program
  .version('0.1')
  .option('-v, --verbose', 'Output all the available logs')
  .option('--dry', 'Instead of executing the command, output what the command would do');

program
  .command('create [module]')
  .description('Use it to create a new component')
  .action(commands.create.bind(scope));

//program
//  .command('init')
//  .description('' +
//  'Initializes a config file with a guided walk-through.\n' +
//  '  - define your root scripts folder\n' +
//  '  - define your core scripts folder\n' +
//  '  - define all other internal folders')
//  .action((require('../lib/cli/init.js')).bind(program));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
