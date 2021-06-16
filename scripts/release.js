const run = require('./run');

run('npm', 'run', 'build');
run('npm', 'publish', './dist');
