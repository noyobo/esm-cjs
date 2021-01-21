#!/usr/bin/env node
const meow = require('meow');
const globby = require('globby');
const fse = require('fs-extra');
const colors = require('colors');
const signale = require('signale');

const esm2cjs = require('../');

colors.enable();

const cli = meow(
  `
  Usage
    $ ej <patterns> [options]
  Options
    --write, -r  Edit files in-place. (Beware!)
  Examples
    $ ej ./**/*.js -r
`,
  {
    flags: {
      write: {
        type: 'boolean',
        alias: 'r',
      },
    },
  }
);

const files = globby.sync(cli.input, {
  absolute: true,
  cwd: process.cwd(),
});

for (let index = 0; index < files.length; index++) {
  const file = files[index];
  try {
    const fileContext = fse.readFileSync(file).toString();
    const code = esm2cjs(fileContext);
    signale.success(file.underline.blue);
    if (cli.flags.write) {
      fse.writeFileSync(file, code);
    }
  } catch (error) {
    console.log(error);
    signale.error(file);
    process.exit(1);
  }
}
