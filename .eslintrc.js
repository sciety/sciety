module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:jest/all',
    'plugin:jest-formatting/strict',
    'plugin:fp-ts/all',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.dev.json',
  },
  plugins: [
    '@typescript-eslint',
    'jest',
    'jest-formatting',
    'node',
    'no-loops',
    'unused-imports',
  ],
  root: true,
  rules: {
    '@typescript-eslint/array-type': ['error', {
      default: 'generic',
    }],
    '@typescript-eslint/brace-style': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'comma',
        requireLast: true,
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false,
      },
    }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-implicit-any-catch': 'error',
    '@typescript-eslint/no-misused-promises': ['error', {
      checksVoidReturn: false,
    }],
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',
    'consistent-return': 'off',
    'default-case': 'off',
    'fp-ts/no-module-imports': 'off',
    'import/no-useless-path-segments': ['error', {
      noUselessIndex: true,
    }],
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
    'import/prefer-default-export': 'off',
    'jest/no-disabled-tests': 'off',
    'jest/no-hooks': 'off',
    'jest/prefer-expect-assertions': 'off',
    'jest/prefer-to-be': 'off',
    'jest/prefer-expect-resolves': 'off',
    'jest/unbound-method': 'off',
    'max-len': ['error', 120, 2, {
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreUrls: true,
    }],
    'no-await-in-loop': 'off',
    'no-loops/no-loops': 2,
    'no-restricted-syntax': ['error', ...[
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ]],
    'no-underscore-dangle': 'off',
    'no-unreachable': 'error',
    'no-void': ['error', {
      allowAsStatement: true,
    }],
    'node/prefer-global/buffer': ['error', 'never'],
    'node/prefer-global/text-decoder': ['error', 'never'],
    'node/prefer-global/text-encoder': ['error', 'never'],
    'node/prefer-global/url': ['error', 'never'],
    'node/prefer-global/url-search-params': ['error', 'never'],
    'sort-imports': ['error', {
      ignoreCase: true,
      ignoreDeclarationSort: true,
    }],
    'unused-imports/no-unused-imports-ts': 'error',
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['feature-test/**/*.ts', 'test/**/*.ts'] }],
  },
  overrides: [
    {
      files: ['src/**/*.ts'],
      rules: {
        'jest/require-hook': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
