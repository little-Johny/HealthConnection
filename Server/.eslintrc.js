module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true, // Activa globals de Jest como describe, test, expect
    },
    extends: ['airbnb-base'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        indent: ['error', 4],
        'no-console': 'off',
        'quote-props': 'off',
        'object-curly-newline': 'off',
        'no-restricted-syntax': 'off',
        'class-methods-use-this': 'off',
        'import/no-extraneous-dependencies' : [
            'error',
            {
                devDependencies: [
                    '**/*.test.js',
                    '**/*.spec.js',
                    '**/test/**',
                    '**/__tests__/**',
                ],
            },
        ],
        'max-len': 'off'
    },
};
