module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:jest/all',
    'plugin:jest-formatting/strict',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    project: './tsconfig.dev.json',
  },
  plugins: [
    '@typescript-eslint',
    'jest',
    'jest-formatting',
  ],
  root: true,
  rules: {
    '@typescript-eslint/brace-style': ['error', '1tbs'],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': ['error', {
      checksVoidReturn: false,
    }],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/array-type': ['error', { default: 'generic' }],
    '@typescript-eslint/prefer-nullish-coalescing': ['error'],
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true,
    }],
    '@typescript-eslint/promise-function-async': ['error'],
    '@typescript-eslint/restrict-template-expressions': ['warn'],
    'jest/no-disabled-tests': 'off',
    'jest/no-hooks': 'off',
    'jest/prefer-expect-assertions': 'off',
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
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'no-void': ['error', { allowAsStatement: true }],
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
