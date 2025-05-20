module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'jsdoc', '@microsoft/eslint-plugin-sdl', 'github'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    "jsdoc/require-jsdoc": [
      "error",
      {
        "publicOnly": false,
        "require": {
          "ArrowFunctionExpression": true,
          "ClassDeclaration": true,
          "ClassExpression": true,
          "FunctionDeclaration": true,
          "FunctionExpression": true,
          "MethodDefinition": true
        },
      }
    ],
    'consistent-return': 'warn',
    eqeqeq: 'error',
    'func-names': 'off',

    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        'newlines-between': 'always',
      },
    ],

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    'import/prefer-default-export': ['off'],

    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/{__tests__,__mocks__}/**',
          '**/*.{stories,test}.{ts,tsx,js,jsx}',
          'src/test/**',
        ],
        optionalDependencies: false,
      },
    ],

    'jsx-a11y/control-has-associated-label': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/no-static-element-interactions': 'error',
    'jsx-a11y/tabindex-no-positive': 'off',
    'jsx-a11y/no-autofocus': 'off',

    'no-alert': 'error',
    'no-bitwise': 'warn',
    'no-console': 'off',
    'no-else-return': 'error',
    'no-irregular-whitespace': 'error',
    'no-shadow': 'error',
    'no-unused-expressions': 'off',
    'no-use-before-define': 'error',
    'no-nested-ternary': 'error',

    'no-void': [
      'error',
      {
        allowAsStatement: true,
      },
    ],

    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],

    'react/button-has-type': 'error',
    'react/default-props-match-prop-types': 'off',
    'react/destructuring-assignment': 'error',
    'react/jsx-no-constructed-context-values': 'error',
    'react/no-array-index-key': 'error',
    'react/no-unstable-nested-components': 'off',
    'react-hooks/exhaustive-deps': 'warn',

    'react/react-in-jsx-scope': ['off'],

    'react/prop-types': ['off'],

    'react/require-default-props': ['off'],

    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],

    'react/function-component-definition': [
      'error',
      {
        namedComponents: ['arrow-function'],
        unnamedComponents: ['arrow-function'],
      },
    ],

    'react/jsx-props-no-spreading': ['off'],

    'react/jsx-no-useless-fragment': [
      'error',
      {
        allowExpressions: true,
      },
    ],

    '@typescript-eslint/no-empty-function': "error",
    '@typescript-eslint/no-explicit-any': "warn",
    '@typescript-eslint/no-non-null-assertion': "error",
    '@typescript-eslint/no-unsafe-argument': "warn",
    '@typescript-eslint/no-unsafe-call': "warn",
    '@typescript-eslint/no-unsafe-member-access': "warn",
    '@typescript-eslint/restrict-template-expressions': "off",

    // xss対策のルールを有効化
    '@microsoft/sdl/no-document-write': 'error',
    '@microsoft/sdl/no-inner-html': 'error',
    'github/no-innerText': 'error',
    'react/no-danger': 'error',
  },
};
