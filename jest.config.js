module.exports = {
  cacheDirectory: './.jest',
  collectCoverageFrom: [
    '**/*.ts',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'lcov', 'html', 'text'],
  roots: ['./src/', './test/'],
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      diagnostics: false,
      isolatedModules: true,
    }],
  },
  verbose: true,
};
