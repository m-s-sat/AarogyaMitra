module.exports = {
    env: {
        node: true,
        es2021: true,
        commonjs: true,
    },
    extends: [
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        // Possible errors
        'no-console': 'warn',
        'no-debugger': 'error',

        // Best practices
        'eqeqeq': 'error',
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-script-url': 'error',
        'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],

        // Stylistic issues
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'no-trailing-spaces': 'error',
        'eol-last': 'error',

        // ES6
        'arrow-spacing': 'error',
        'no-var': 'error',
        'prefer-const': 'error',

        // Node.js specific
        'no-process-exit': 'error',
        'no-path-concat': 'error',
    },
    ignorePatterns: [
        'node_modules/',
        '*.min.js',
        'dist/',
        'build/',
    ],
};
