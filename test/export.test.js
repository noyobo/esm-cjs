const transform = require('../lib/transform');

describe('transform export', () => {
  it('should exporting individual features', () => {
    let code;
    code = transform(`export let a, b, c;`);
    expect(code).toMatchSnapshot();
    code = transform(`export let a = 1, b = 2, c = 3;`);
    expect(code).toMatchSnapshot();
    code = transform(`export function foo(){ /**/ };`);
    expect(code).toMatchSnapshot();
    code = transform(`export class ClassName { }`);
    expect(code).toMatchSnapshot();
  });

  it('should export list', () => {
    const code = transform(`const a = 1; const b = 2; export { a, b }`);
    expect(code).toMatchSnapshot();
  });

  it('should renaming exports', () => {
    const code = transform(`var variable1 = 1;
var variable2 = 2;

export { variable1 as name1, variable2 as name2 };`);
    expect(code).toMatchSnapshot();
  });

  it('should default exports', () => {
    let code;
    code = transform(`export default true`);
    expect(code).toMatchSnapshot();
    code = transform(`export default function () {  }`);
    expect(code).toMatchSnapshot();
    code = transform(`export default function name1() {  }`);
    expect(code).toMatchSnapshot();
    code = transform(`export default class ClassName {}`);
    expect(code).toMatchSnapshot();
  });
});
