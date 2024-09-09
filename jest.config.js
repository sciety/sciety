module.exports = {
  cacheDirectory: './.jest',
  collectCoverageFrom: [
    '**/*.ts',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'lcov', 'html', 'text'],
  reporters: ['jest-wip-reporter'],
  roots: ['./src/', './test/'],
  setupFilesAfterEnv: ['./test/jest.setup.ts'],
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': [
      'esbuild-jest',
      {
        sourcemap: true,
      }],
  },
  transformIgnorePatterns: ['\\.pnp\\.[^\\\/]+$'],
  verbose: true,
};
