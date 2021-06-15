const { spawnSync } = require('child_process');

/**
 * @param {string} cmd
 * @param {string[]} args
 * @returns {import('child_process').SpawnSyncReturns<Buffer>}
 */
module.exports = function run(cmd, ...args) {
    const proc = spawnSync(cmd, args, {
        stdio: [
            process.stdin,
            process.stdout,
            process.stderr
        ],
        shell: true
    });

    if (proc.status !== 0) {
        process.exit(proc.status);
    }

    return proc;
};
