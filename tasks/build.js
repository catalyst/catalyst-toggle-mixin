// Load config.
const config = require('./config.js');

// Libraries.
const gulp = require('gulp');
const escodegen = require('escodegen');
const esprima = require('esprima');
const modifyFile = require('gulp-modify-file');
const prettier = require('prettier');
const rename = require('gulp-rename');
const webpack = require('webpack');
const WebpackClosureCompilerPlugin = require('webpack-closure-compiler');
const webpackStream = require('webpack-stream');

/**
 * Create the element module file.
 *
 * @returns {NodeJS.ReadWriteStream}
 */
function createElementModule() {
  return gulp
    .src(`./${config.src.path}/${config.src.entrypoint}`)
    .pipe(
      modifyFile(content => {
        return content.replace(
          new RegExp(`../node_modules/${config.mixin.scope}/`, 'g'),
          '../'
        );
      })
    )
    .pipe(
      rename({
        basename: config.mixin.name,
        extname: '.js'
      })
    )
    .pipe(gulp.dest(`./${config.temp.path}`));
}

/**
 * Create the element file.
 *
 * @returns {NodeJS.ReadWriteStream}
 */
function createElementScript() {
  return gulp
    .src(`./${config.src.path}/${config.src.entrypoint}`)
    .pipe(
      modifyFile(content => {
        /**
         * Strip the imports and exports out of the parse code and return them.
         *
         * @param {Program} parsedCode
         *   The parsed code.
         * @returns {{imports:Map<number,Object>, exports:Map<number,Object>}}
         */
        const stripImportsAndExports = parsedCode => {
          // Get info about the code.
          const codeIndexesToRemove = [];
          const imports = new Map();
          const exports = new Map();
          for (let i = 0; i < parsedCode.body.length; i++) {
            switch (parsedCode.body[i].type) {
              case 'ImportDeclaration':
                for (let j = 0; j < parsedCode.body[i].specifiers.length; j++) {
                  if (
                    (parsedCode.body[i].specifiers[j].type ===
                      'ImportDefaultSpecifier' &&
                      parsedCode.body[i].specifiers[j].local.name.startsWith(
                        'Catalyst'
                      )) ||
                    (parsedCode.body[i].specifiers[j].type ===
                      'ImportSpecifier' &&
                      parsedCode.body[i].specifiers[j].imported.name.startsWith(
                        'Catalyst'
                      ))
                  ) {
                    imports.set(i, parsedCode.body[i]);
                    codeIndexesToRemove.push(i);
                  }
                }
                break;

              case 'ExportDefaultDeclaration':
              case 'ExportNamedDeclaration':
                exports.set(i, parsedCode.body[i]);
                codeIndexesToRemove.push(i);
                break;

              // Different type? Do nothing.
              default:
            }
          }

          // Remove imports and exports.
          parsedCode.body = parsedCode.body.filter(
            (e, i) => !codeIndexesToRemove.includes(i)
          );

          return {
            imports: imports,
            exports: exports
          };
        };

        /**
         * Replace catalyst element's imports with globally accessible object import.
         *
         * @param {Program} parsedCode
         *   The parsed code with the imports already stripped out.
         * @param {Map<number,Object>} imports
         *   The imports that have been stripped out of the parsed code.
         */
        const processImports = (parsedCode, imports) => {
          for (const importDefIndex of Object.keys(imports)) {
            const importDef = imports[importDefIndex];
            for (const specifier of Object.values(importDef.specifiers)) {
              const localName = specifier.local.name;
              const importedName = specifier.imported
                ? specifier.imported.name
                : localName;

              if (importedName.startsWith('Catalyst')) {
                parsedCode.body.splice(
                  importDefIndex,
                  0,
                  esprima.parseScript(
                    `let ${localName} = window.CatalystElements.${importedName};`
                  )
                );
              } else {
                throw new Error(
                  `Cannot automatically process import "${importedName}"`
                );
              }
            }
          }
        };

        /**
         * Replace exports with globally accessible object exports.
         *
         * @param {Program} parsedCode
         *   The parsed code with the exports already stripped out.
         * @param {Map<number,Object>} exports
         *   The exports that have been stripped out of the parsed code.
         */
        const processExports = (parsedCode, exports) => {
          const exportNamesUsed = [];

          // Replace exports with globally accessible object exports.
          for (const exportDefIndex of Object.keys(exports)) {
            const exportDef = exports[exportDefIndex];
            if (exportDef.declaration === null) {
              for (const specifier of Object.values(exportDef.specifiers)) {
                const localName = specifier.local.name;
                const exportedName = specifier.imported
                  ? specifier.imported.name
                  : localName;

                if (!exportNamesUsed.includes(exportedName)) {
                  parsedCode.body.splice(
                    exportDefIndex,
                    0,
                    esprima.parseScript(
                      `window.CatalystElements.${exportedName} = ${localName};`
                    )
                  );
                  exportNamesUsed.push(exportedName);
                }
              }
            } else if (exportDef.declaration.type === 'Identifier') {
              if (!exportNamesUsed.includes(exportDef.declaration.name)) {
                parsedCode.body.splice(
                  exportDefIndex,
                  0,
                  esprima.parseScript(
                    `window.CatalystElements.${exportDef.declaration.name} = ${
                      exportDef.declaration.name
                    };`
                  )
                );
                exportNamesUsed.push(exportDef.declaration.name);
              }
            } else {
              console.error(
                `Cannot automatically process declaration in ${exportDef.type}.`
              );
            }
          }
        };

        // Parse the code.
        const parsedCode = esprima.parseModule(content);

        // Run functions defined above.
        const { imports, exports } = stripImportsAndExports(parsedCode);
        processImports(parsedCode, imports);
        processExports(parsedCode, exports);

        // Generate the updated code.
        return (
          'window.CatalystElements = window.CatalystElements || {};\n' +
          `${escodegen.generate(parsedCode)}`
        );
      })
    )
    .pipe(
      rename({
        basename: config.mixin.name,
        extname: '.script.js'
      })
    )
    .pipe(gulp.dest(`./${config.temp.path}`));
}

// Create the module file.
gulp.task('create-element:module', () => {
  return createElementModule();
});

// Create the script file.
gulp.task('create-element:script', () => {
  return createElementScript();
});

// Build the es6 module version of the component.
gulp.task(
  'build-module',
  gulp.series('create-element:module', () => {
    return gulp
      .src(`./${config.temp.path}/${config.mixin.name}.js`)
      .pipe(gulp.dest(`./${config.dist.path}`));
  })
);

// Build the es5 script version of the component.
gulp.task(
  'build-script',
  gulp.series('create-element:script', () => {
    return gulp
      .src(`./${config.temp.path}/${config.mixin.name}.script.js`)
      .pipe(
        webpackStream(
          {
            target: 'web',
            mode: 'production',
            output: {
              chunkFilename: `${config.mixin.name}.part-[id].es5.min.js`,
              filename: `${config.mixin.name}.es5.min.js`
            },
            plugins: [
              new WebpackClosureCompilerPlugin({
                compiler: {
                  language_in: 'ECMASCRIPT_NEXT',
                  language_out: 'ECMASCRIPT5',
                  compilation_level: 'SIMPLE',
                  assume_function_wrapper: true,
                  output_wrapper: '(function(){%output%}).call(this)'
                }
              })
            ]
          },
          webpack
        )
      )
      .pipe(gulp.dest(`./${config.dist.path}`));
  })
);

gulp.task(
  'build-finalize',
  gulp.parallel(
    () => {
      return gulp
        .src(['README.md', 'LICENSE'])
        .pipe(gulp.dest(`./${config.dist.path}`));
    },
    () => {
      return gulp
        .src('package.json')
        .pipe(
          modifyFile(content => {
            const json = JSON.parse(content);
            json.main = `${config.mixin.name}.js`;
            json.scripts = {
              prepublishOnly:
                "node -e \"assert.equal(require('./package.json').version, require('../package.json').version)\""
            };
            delete json.directories;
            delete json.engines;
            delete json.devDependencies;
            return prettier.format(JSON.stringify(json), { parser: 'json' });
          })
        )
        .pipe(gulp.dest(`./${config.dist.path}`));
    }
  )
);

gulp.task('build-symlinks', () => {
  return gulp
    .src(`./${config.dist.path}/${config.mixin.name}**.js`)
    .pipe(gulp.symlink('./'));
});

// Build all the component's versions.
gulp.task(
  'build',
  gulp.series(
    'clean-dist',
    gulp.parallel('build-module', 'build-script'),
    gulp.parallel('build-finalize', 'clean-tmp'),
    'build-symlinks'
  )
);
