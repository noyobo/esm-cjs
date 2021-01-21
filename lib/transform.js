const parser = require('@babel/parser');
const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const template = require('@babel/template').default;

const cjsRequire = (dep) => {
  if (dep.star) {
    return template.ast(`const ${dep.alias} = require('${dep.name}');`);
  } else if (dep.default) {
    if (dep.members) {
      return template.ast(`const ${dep.default} = require('${dep.name}');
${dep.members.map((member) => `const ${member.alias} = ${dep.default}.${member.name}`).join('\n')};
`);
    } else {
      return template.ast(`const ${dep.default} = require('${dep.name}');`);
    }
  } else if (dep.members.length > 0) {
    return template.ast(`const ${dep.uniqueName} = require('${dep.name}');
${dep.members.map((member) => `const ${member.alias} = ${dep.uniqueName}.${member.name}`).join('\n')};
`);
  }
};

module.exports = function (input) {
  const ast = parser.parse(input, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript',
      'doExpressions',
      'objectRestSpread',
      ['decorators', { decoratorsBeforeExport: true }],
      'classProperties',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'asyncGenerators',
      'functionBind',
      'functionSent',
      'dynamicImport',
      'optionalChaining',
      'nullishCoalescingOperator',
    ],
  });
  traverse(ast, {
    ImportDeclaration(path, state) {
      const { node } = path;
      let dep = {};
      if (node.source && node.source.value) {
        let depName = node.source.value;
        dep.name = depName;
        dep.uniqueName = path.scope.generateUid(depName);
      }
      for (let i = 0; i < node.specifiers.length; i++) {
        let specifiersNode = node.specifiers[i];
        let specifiersType = specifiersNode.type;
        switch (specifiersType) {
          case 'ImportDefaultSpecifier':
            dep.default = specifiersNode.local.name;
            break;
          case 'ImportSpecifier':
            dep.members = dep.members || [];
            dep.members.push({
              name: specifiersNode.imported.name,
              alias: specifiersNode.local.name,
            });
            break;
          case 'ImportNamespaceSpecifier':
            dep.star = true;
            dep.alias = specifiersNode.local.name;
            break;
          default:
            return;
        }
      }
      const cjsNode = cjsRequire(dep);
      path.replaceWithMultiple(cjsNode);
    },
  });

  const { code } = generator(ast);

  return code;
};
