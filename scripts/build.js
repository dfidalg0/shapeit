const fs = require('fs');
const run = require('./run');
const path = require('path');

run('tsc', '--build');

process.chdir(path.join(__dirname, '..'));

for (const file of ['package.json', 'README.md', 'LICENSE']) {
    fs.copyFileSync(file, `dist/${file}`);
}
