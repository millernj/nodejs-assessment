const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coveragePathIgnorePatterns: ['/node_modules/'],
	modulePathIgnorePatterns: ['<rootDir>/dist/'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};
