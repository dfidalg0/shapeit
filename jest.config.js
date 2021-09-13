const { pathsToModuleNameMapper } = require('ts-jest/utils');

const { compilerOptions: { paths } } = require('./tests/tsconfig.json');

/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/*.ts', 'src/**/*.ts'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/src/index.ts'
    ],
    coverageProvider: 'babel',
    coverageReporters: [
        'json',
        'lcov'
    ],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tests/tsconfig.json'
        },
    },
    moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
    modulePathIgnorePatterns: [
        './dist'
    ],
    rootDir: '.',
    setupFiles: [
        '<rootDir>/tests/setup.ts'
    ],
    testMatch: [
        '<rootDir>/tests/**/*.spec.ts',
    ],
    transform: {
        '.*\\.ts': 'ts-jest'
    },
};
