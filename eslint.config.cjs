const eslintConfigPrettier = require('eslint-config-prettier');
const tsParser = require('@typescript-eslint/parser');
const vueParser = require('vue-eslint-parser');

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
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: { sourceType: 'module' },
        },
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsParser,
                extraFileExtensions: ['.vue'],
                sourceType: 'module',
            },
        },
    },
    eslintConfigPrettier,
];
