# esm-cjs

[![](https://github.com/noyobo/esm-cjs/workflows/Testing/badge.svg)](https://github.com/noyobo/esm-cjs/actions?query=workflow%3ATesting) [![Codecov](https://img.shields.io/codecov/c/github/noyobo/esm-cjs/main.svg)](https://codecov.io/gh/noyobo/esm-cjs/branch/main) [![npm package](https://img.shields.io/npm/v/esm-cjs.svg)](https://www.npmjs.org/package/esm-cjs) [![NPM downloads](http://img.shields.io/npm/dm/esm-cjs.svg)](https://npmjs.org/package/esm-cjs)

Transform ESM to Common JS for present NodeJS, without any junk wrappers or useless renaming.

## Usage

```js
const esm2cjs = require('esm-cjs');

const input = `import { bar } from 'foo';`;

const output = esm2cjs(input);

// const { bar }  = require('foo');
```

## Command line

```bash
ej --help
ej ./**/*.js --write
```

## TODO

- [ ] Aggregating modules
