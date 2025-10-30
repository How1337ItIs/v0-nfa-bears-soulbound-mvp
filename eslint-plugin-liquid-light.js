/**
 * CUSTOM ESLINT PLUGIN FOR LIQUID LIGHT SYSTEM
 * 
 * Custom ESLint rules specific to the liquid light system
 * to enforce best practices and prevent common issues.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

module.exports = {
  rules: {
    'no-hardcoded-colors': {
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              // Check for hardcoded color values
              const colorRegex = /^#[0-9a-fA-F]{3,6}$|^rgb\(|^rgba\(|^hsl\(|^hsla\(/;
              if (colorRegex.test(node.value)) {
                context.report({
                  node,
                  message: 'Use PaletteDirector.getColorRGB() instead of hardcoded colors',
                  suggest: [
                    {
                      desc: 'Replace with PaletteDirector.getColorRGB()',
                      fix: (fixer) => {
                        return fixer.replaceText(node, 'PaletteDirector.getColorRGB(0)');
                      },
                    },
                  ],
                });
              }
            }
          },
        };
      },
    },

    'prefer-palette-director': {
      create(context) {
        return {
          CallExpression(node) {
            if (
              node.callee.type === 'MemberExpression' &&
              node.callee.object.name === 'PaletteDirector' &&
              node.callee.property.name === 'getColorRGB'
            ) {
              // Check if PaletteDirector is imported
              const sourceCode = context.getSourceCode();
              const program = sourceCode.ast;
              const imports = program.body.filter(
                (node) => node.type === 'ImportDeclaration'
              );
              
              const hasPaletteImport = imports.some(
                (importNode) => importNode.source.value.includes('PaletteDirector')
              );
              
              if (!hasPaletteImport) {
                context.report({
                  node,
                  message: 'PaletteDirector must be imported before use',
                });
              }
            }
          },
        };
      },
    },

    'no-direct-webgl-calls': {
      create(context) {
        return {
          CallExpression(node) {
            if (
              node.callee.type === 'MemberExpression' &&
              node.callee.object.name === 'gl' &&
              ['createShader', 'createProgram', 'createBuffer', 'createTexture'].includes(
                node.callee.property.name
              )
            ) {
              context.report({
                node,
                message: 'Use WebGL2Optimizer or GPUMemoryManager instead of direct WebGL calls',
              });
            }
          },
        };
      },
    },

    'prefer-audio-bus': {
      create(context) {
        return {
          CallExpression(node) {
            if (
              node.callee.type === 'MemberExpression' &&
              node.callee.object.name === 'audioContext' &&
              ['createAnalyser', 'createMediaStreamSource'].includes(
                node.callee.property.name
              )
            ) {
              context.report({
                node,
                message: 'Use AudioBus instead of direct AudioContext calls',
              });
            }
          },
        };
      },
    },

    'no-console-in-production': {
      create(context) {
        return {
          CallExpression(node) {
            if (
              node.callee.type === 'MemberExpression' &&
              node.callee.object.name === 'console' &&
              ['log', 'warn', 'error', 'info', 'debug'].includes(
                node.callee.property.name
              )
            ) {
              // Check if this is in a production build
              const filename = context.getFilename();
              if (filename.includes('dist/') || filename.includes('build/')) {
                context.report({
                  node,
                  message: 'Console statements should not be used in production builds',
                });
              }
            }
          },
        };
      },
    },

    'prefer-performance-monitoring': {
      create(context) {
        return {
          CallExpression(node) {
            if (
              node.callee.type === 'MemberExpression' &&
              node.callee.object.name === 'performance' &&
              node.callee.property.name === 'now'
            ) {
              // Check if this is in a performance-critical file
              const filename = context.getFilename();
              if (filename.includes('lib/performance/')) {
                context.report({
                  node,
                  message: 'Use PerformanceProfiler instead of direct performance.now() calls',
                });
              }
            }
          },
        };
      },
    },
  },
};
