const transform = require('../lib/transform');

describe('transform import', () => {
  it('should star import', () => {
    expect(transform(`import * as foo from 'foo';`)).toMatchSnapshot();
  });

  it('should default import', () => {
    expect(transform(`import foo from 'foo';`)).toMatchSnapshot();
  });

  it('should import members', () => {
    expect(transform(`import { a, b, c } from 'foo';`)).toMatchSnapshot();
  });

  it('should import members alias', () => {
    expect(transform(`import { a as d, b as e, c } from 'foo';`)).toMatchSnapshot();
  });

  it('should import members and default', () => {
    expect(transform(`import d, { a, b, c } from 'foo';`)).toMatchSnapshot();
  });
});
