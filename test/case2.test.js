const code = `import {
  root,
  templateMethods
} from "../../../../chunk-STXT7BRD.js";
import "../../../../chunk-UN2MHHJ5.js";
export {
  root as default,
  templateMethods
};`;

const transform = require('../lib/transform');

describe('transform import case1', () => {
  it('should work', () => {
    expect(transform(code)).toMatchSnapshot();
  });
});
