# esm-cjs

Transform ESM to Common JS for present NodeJS, without any junk wrappers or useless renaming.

## Usage

```js
const esm2cjs = require('esm-cjs');

const input = `import { bar } from 'foo';`

const output = esm2cjs(input);

// const { bar }  = require('foo');

## TODO

- [ ] Aggregating modules
```
