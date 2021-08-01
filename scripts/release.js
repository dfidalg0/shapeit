const run = require('./run');
const cp = require('child_process');
const pkg = require('../package.json');
const { compare } = require('compare-versions');

const npmProc = cp.spawnSync('npm', ['view', pkg.name, 'version'], {
    stdio: [
        'ignore',
        'pipe',
        'ignore'
    ],
    encoding: 'utf-8'
});

const regVersion = npmProc.stdout.slice(0, -1) || '0.0.0';
const pkgVersion = pkg.version;

if (compare(pkgVersion, regVersion, '>')) {
    run('npm', 'run', 'build');
    run('npm', 'publish', './dist');
}
else {
    console.log('No release needed');
}
