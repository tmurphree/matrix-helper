const eslintConfigPrettier = require('eslint-config-prettier');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
    {
        ignores: ['coverage/**', 'dist/**', '.nuxt/**', '.output/**'],
    },
    {
        rules: {
            curly: ['error', 'all'],
        },
    },
    eslintConfigPrettier,
];
