const parser = require('@babel/parser');
const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const template = require('@babel/template').default;
const t = require('@babel/types');

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
  } else {
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
    ImportDeclaration(path) {
      const { node } = path;
      let dep = {};

      let depName = node.source.value;
      dep.name = depName;
      dep.uniqueName = path.scope.generateUid(depName);

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
            throw new Error(`Not support specifiers.type:${specifiersType}`);
        }
      }
      const cjsNode = cjsRequire(dep);
      path.replaceWithMultiple(cjsNode);
    },

    ExportNamedDeclaration(path) {
      const node = path.node;
      if (node.source && node.source.value) {
        throw new Error('Not support export aggregating modules');
      }

      if (node.specifiers.length == 0) {
        if (['FunctionDeclaration', 'ClassDeclaration'].includes(node.declaration.type)) {
          const name = node.declaration.id.name;
          path.replaceWith(node.declaration);
          path.insertAfter(template.ast(`exports.${name} = ${name}`));
        } else if (node.declaration.type === 'VariableDeclaration') {
          path.replaceWith(node.declaration);
          const declarations = node.declaration.declarations;
          const code = declarations
            .map((declaration) => {
              return `exports.${declaration.id.name} = ${declaration.id.name};`;
            })
            .join('\n');
          path.insertAfter(template.ast(code));
        } else {
          //
        }
      } else {
        const code = node.specifiers
          .map((specifier) => {
            return `exports.${specifier.exported.name} = ${specifier.local.name};`;
          })
          .join('\n');

        path.replaceWithMultiple(template.ast(code));
      }
    },

    ExportDefaultDeclaration(path) {
      const node = path.node;
      const declarationType = node.declaration.type;
      if (['BooleanLiteral'].includes(declarationType)) {
        const defaultName = path.scope.generateUid('default');
        const defaultDefined = template(`const %%default%% = %%target%%`)({
          default: t.identifier(defaultName),
          target: node.declaration,
        });

        path.replaceWith(defaultDefined);
        path.insertAfter(template.ast(`module.exports = ${defaultName};`));
      } else if (['FunctionDeclaration', 'ClassDeclaration'].includes(declarationType)) {
        let defaultName = path.scope.generateUid('default');
        const funcDeclaration = node.declaration;
        if (funcDeclaration.id) {
          defaultName = funcDeclaration.id.name;
        } else {
          funcDeclaration.id = t.identifier(defaultName);
        }
        path.replaceWith(funcDeclaration);
        path.insertAfter(template.ast(`module.exports = ${defaultName};`));
      } else if (['CallExpression', 'NewExpression', 'ObjectExpression'].includes(declarationType)) {
        let defaultName = path.scope.generateUid('default');

        const defaultDefined = template(`const %%default%% = %%target%%`)({
          default: t.identifier(defaultName),
          target: node.declaration,
        });

        path.replaceWith(defaultDefined);
        path.insertAfter(template.ast(`module.exports = ${defaultName};`));
      } else if (['Identifier'].includes(declarationType)) {
        let defaultName = path.scope.generateUid('default');
        path.replaceWith(template.ast(`const ${defaultName} = ${node.declaration.name}`));
        path.insertAfter(template.ast(`module.exports = ${defaultName};`));
      } else {
        throw new Error(`Not support declaration type: ${declarationType}`);
      }
    },
  });

  const { code } = generator(ast);

  return code;
};
