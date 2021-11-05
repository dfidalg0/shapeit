const fs = require('fs');
const run = require('./run');
const path = require('path');
const package = require('../package.json');
const { omit } = require('lodash');

process.chdir(path.join(__dirname, '..'));

run('vite', 'build');
run('tsc', '--build');

const data = omit(package, 'scripts');

fs.writeFileSync('dist/package.json', JSON.stringify(data, null, 2));

for (const file of ['README.md', 'LICENSE']) {
    fs.copyFileSync(file, `dist/${file}`);
}
