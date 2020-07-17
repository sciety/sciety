module.exports = {
  env: {
    es2020: true,
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
    project: './tsconfig.dev.json',
  },
  plugins: [
    '@typescript-eslint',
    'jest',
    'jest-formatting',
  ],
  root: true,
  rules: {
    '@typescript-eslint/array-type': ['error', {
      default: 'generic',
    }],
    '@typescript-eslint/brace-style': 'error',
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true,
    }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': ['error', {
      checksVoidReturn: false,
    }],
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    'import/order': ['error', {
      alphabetize: {
        order: 'asc',
      },
      groups: [
        'builtin',
        'external',
        'internal',
        'index',
        'sibling',
        'parent',
      ],
    }],
    'jest/no-disabled-tests': 'off',
    'jest/no-hooks': 'off',
    'jest/prefer-expect-assertions': 'off',
    'max-len': ['error', 120, 2, {
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreUrls: true,
    }],
    'no-restricted-syntax': ['error', ...[
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ]],
    'no-void': ['error', {
      allowAsStatement: true,
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
