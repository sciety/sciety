module.exports = {
  cacheDirectory: '../.jest',
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true,
      tsConfig: 'tsconfig.dev.json',
    },
  },
  rootDir: 'test',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
};
