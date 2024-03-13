module.exports = {
  cacheDirectory: './.jest',
  collectCoverageFrom: [
    '**/*.ts',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'lcov', 'html', 'text'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  reporters: ['jest-wip-reporter'],
  roots: ['./src/', './test/'],
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  transform: { '^.+\\.(t|j)sx?$': '@swc/jest' },
  transformIgnorePatterns: ['\\.pnp\\.[^\\/]+$'],
  verbose: true,
};
