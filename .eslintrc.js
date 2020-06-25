module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true
    },
    extends: ['standard'],
    globals: {
        test: true,
        expect: true
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
        ],
        semi: ['error', 'always']
    }
};
