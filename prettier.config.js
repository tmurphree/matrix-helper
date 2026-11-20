export default {
    arrowParens: 'always',
    bracketSameLine: false,
    bracketSpacing: true,
    plugins: ['prettier-plugin-organize-imports'],
    printWidth: 125,
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'es5',
    useTabs: false,
    vueIndentScriptAndStyle: true,
    ignorePatterns: [
        'dist/**/*',
        'documents/**/*',
        'node_modules/**/*',
    ]
};
