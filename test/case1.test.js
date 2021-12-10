const code = `import {
  __toModule,
  require_es
} from "../../chunk-ODN36SKU.js";

var import_miniapp_ast2vnode = __toModule(require_es());
var sjsModules = {};
var templateMethods = {};
var includeModules = {};
var ast2VNode = new import_miniapp_ast2vnode.default({
  templateMethods,
  sjsModules,
  includeModules
});
function root(data) {
  this.sjsModules = sjsModules;
  let vnode = ast2VNode.makeMix({
    children: [
      {
        type: "node",
        name: "view",
        attributes: { class: "foo" },
        children: [{ exps: ["key"], expression: 'ty.key+("\u7EC4\u4EF6")' }]
      }
    ]
  }, data);
  return vnode;
}
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
