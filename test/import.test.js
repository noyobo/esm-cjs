const transform = require('../lib/transform');

describe('transform import', () => {
  it('should star import', () => {
    expect(transform(`import * as foo from 'foo';`)).toEqual(`const foo = require('foo');`);
  });

  it('should default import', () => {
    expect(transform(`import foo from 'foo';`)).toEqual(`const foo = require('foo');`);
  });

  it('should import members', () => {
    expect(transform(`import { a, b, c } from 'foo';`)).toEqual(`const _foo = require('foo');

const a = _foo.a;
const b = _foo.b;
const c = _foo.c;`);
  });

  it('should import members alias', () => {
    expect(transform(`import { a as d, b as e, c } from 'foo';`)).toEqual(`const _foo = require('foo');

const d = _foo.a;
const e = _foo.b;
const c = _foo.c;`);
  });

  it('should import members and default', () => {
    expect(transform(`import d, { a, b, c } from 'foo';`)).toEqual(`const d = require('foo');

const a = d.a;
const b = d.b;
const c = d.c;`);
  });
});
