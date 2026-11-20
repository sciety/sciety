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
      },
    ],
    '/node_modules/\\.pnpm/(htmlparser2|domhandler|domutils|domelementtype|dom-serializer|entities)@[^/]+/.+\\.js$': [
      'esbuild-jest',
      {
        sourcemap: true,
      },
    ],
  },
  transformIgnorePatterns: ['\\.pnp\\.[^\\\/]+$'],
  verbose: true,
};
