/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'warn',
      from: {},
      to: { circular: true }
    },
    {
      name: 'no-orphans',
      severity: 'error',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$', // dot files
          '\\.d\\.ts$',                            // TypeScript declaration files
          '(^|/)tsconfig\\.json$',                 // TypeScript config
          '(^|/)(babel|webpack)\\.config\\.(js|cjs|mjs|ts|json)$' // other configs
        ]
      },
      to: {},
    },
    {
      name: 'no-deprecated-core',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: [ 'core' ],
        path: [
          '^(v8\/tools\/codemap)$',
          '^(v8\/tools\/consarray)$',
          '^(v8\/tools\/csvparser)$',
          '^(v8\/tools\/logreader)$',
          '^(v8\/tools\/profile_view)$',
          '^(v8\/tools\/profile)$',
          '^(v8\/tools\/SourceMap)$',
          '^(v8\/tools\/splaytree)$',
          '^(v8\/tools\/tickprocessor-driver)$',
          '^(v8\/tools\/tickprocessor)$',
          '^(node-inspect\/lib\/_inspect)$',
          '^(node-inspect\/lib\/internal\/inspect_client)$',
          '^(node-inspect\/lib\/internal\/inspect_repl)$',
          '^(async_hooks)$',
          '^(punycode)$',
          '^(domain)$',
          '^(constants)$',
          '^(sys)$',
          '^(_linklist)$',
          '^(_stream_wrap)$'
        ],
      }
    },
    {
      name: 'not-to-deprecated',
      severity: 'warn',
      from: {},
      to: { dependencyTypes: [ 'deprecated' ] }
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      from: {},
      to: { dependencyTypes: [ 'npm-no-pkg', 'npm-unknown' ] }
    },
    {
      name: 'not-to-unresolvable',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true }
    },
    {
      name: 'no-duplicate-dep-types',
      severity: 'warn',
      from: {},
      to: {
        moreThanOneDependencyType: true,
        dependencyTypesNot: ["type-only"]
      }
    },
    {
      name: 'not-to-test',
      severity: 'error',
      from: { pathNot: '^(../test)' },
      to: { path: '^(../test)' }
    },
    {
      name: 'not-to-spec',
      severity: 'error',
      from: {},
      to: { path: '\\.(spec|test)\\.(js|mjs|cjs|ts|ls|coffee|litcoffee|coffee\\.md)$' }
    },
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      from: {
        path: '^(../src)',
        pathNot: '\\.(spec|test)\\.(js|mjs|cjs|ts|ls|coffee|litcoffee|coffee\\.md)$'
      },
      to: { dependencyTypes: [ 'npm-dev' ] }
    },
    {
      name: 'optional-deps-used',
      severity: 'info',
      from: {},
      to: { dependencyTypes: [ 'npm-optional' ] }
    },
    {
      name: 'peer-deps-used',
      severity: 'warn',
      from: {},
      to: { dependencyTypes: [ 'npm-peer' ] }
    }
  ],
  options: {
    tsPreCompilationDeps: true,
    doNotFollow: { path: 'node_modules' },
    includeOnly : 'src',
    reaches: 'src/write-side',
    collapse: 3,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"]
    },
    reporterOptions: {
      archi: {
        collapsePattern: '^src/(html-pages|shared-components|docmaps|third-parties)',
        theme: {
          graph: { rankdir: "LR" },
          node: {
            shape: 'box',
            style: 'rounded, filled',
          },
          edge: {
            style: 'dashed',
            penwidth: '1.0',
            color: '#888888',
          },
          modules: [
            {
              criteria: { consolidated: true },
              attributes: {
                shape: 'folder',
                style: 'rounded, filled',
              },
            },
            {
              criteria: { source: 'write-side' },
              attributes: { fillcolor: '#c9dff4' },
            },
            {
              criteria: { source: 'html-pages|views|shared-components|docmaps|coupling' },
              attributes: { fillcolor: 'white' },
            },
            {
              criteria: { source: 'infrastructure|framework|http' },
              attributes: { fillcolor: '#f8cce0' },
            },
            {
              criteria: { source: 'sagas' },
              attributes: { fillcolor: '#d0bfe8' },
            },
          ],
        },
      },
      "text": {
        "highlightFocused": true,
      },
    }
  }
};
