'use strict'
module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
        jest: true
    },
    extends: [
        'standard'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 11
    },
    rules: {
        indent: [
            'error',
            4,
            {
                SwitchCase: 1
            }
        ]
    }
}
