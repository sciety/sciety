module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:jest-formatting/strict',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    project: './tsconfig.lint.json',
  },
  plugins: [
    '@typescript-eslint',
    'jest',
    'jest-formatting',
  ],
  root: true,
  rules: {
    '@typescript-eslint/brace-style': ['error', '1tbs'],
    'import/order': ['error', {
      alphabetize: { order: 'asc' },
      groups: ['builtin', 'external', 'internal', 'index', 'sibling', 'parent'],
    }],
    'max-len': ['error', 120, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'sort-imports': ['error', {
      ignoreCase: true,
      ignoreDeclarationSort: true,
    }],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
