module.exports = {
  cacheDirectory: './.jest',
  collectCoverageFrom: [
    '**/*.ts',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text'],
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true,
      tsconfig: 'tsconfig.dev.json',
    },
  },
  roots: ['./src/', './test/'],
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
};
