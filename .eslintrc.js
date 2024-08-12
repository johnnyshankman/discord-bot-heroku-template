module.exports = {
  root: true,
  env: {
    node: true
  },
  "parserOptions": {
    ecmaVersion: 2018,
    "sourceType": "module"
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'semi': [2, 'never'],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
