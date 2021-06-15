const cp = require('child_process');
const run = require('./run');

run('npm', 'run', 'build');
run('npm', 'publish', 'dist');
