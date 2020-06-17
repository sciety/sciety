module.exports = {
  cacheDirectory: '../.jest',
  globals: {
    'ts-jest': {
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
