// Libraries.
const fs = require('graceful-fs');

// Load package.json
const packageInfo = JSON.parse(fs.readFileSync('./package.json'));

let scope = packageInfo.name.substring(0, packageInfo.name.lastIndexOf('/'));
if (scope === '') {
  scope = null;
}

module.exports = {
  mixin: {
    name: 'catalyst-toggle-mixin',
    export: 'CatalystToggleMixin',
    scope: scope,
    nodeScopePath: `node_modules${scope === null ? '' : `/${scope}`}`
  },

  src: {
    path: 'src',
    entrypoint: 'mixin.js'
  },

  dist: {
    path: 'dist'
  },

  docs: {
    path: 'docs',
    indexPage: 'index.html',
    nodeModulesPath: 'scripts',
    importsFilename: 'docs-imports.js',
    importsImporterFilename: 'docs-imports-importer.js',
    analysisFilename: 'analysis.json'
  },

  tasks: {
    path: 'tasks'
  },

  temp: {
    path: 'tmp'
  },

  package: packageInfo
};
