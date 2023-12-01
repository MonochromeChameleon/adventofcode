module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier', 'filenames'],
  rules: {
    'no-useless-call': 2,
    'object-shorthand': 2,
    'prefer-arrow-callback': 2,
    'prefer-destructuring': 0,
    'space-infix-ops': 2,
    'class-methods-use-this': 0,
    'no-underscore-dangle': 0,
    'no-bitwise': 0,
    'max-classes-per-file': 0,
    'no-param-reassign': 0,
    'default-case': 0,
    'consistent-return': 0,
    'no-nested-ternary': 0,
    'no-constant-condition': 0,

    'filenames/no-index': 2,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 2,
    'import/prefer-default-export': 0,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  globals: {
    BigInt: true,
    describe: true,
    it: true,
  },
};
