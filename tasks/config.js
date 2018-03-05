// Libraries.
const fs = require('graceful-fs');

// Load package.json
let packageInfo = JSON.parse(fs.readFileSync('./package.json'));

module.exports = {

  mixin: {
    name: 'catalyst-toggle-mixin',
    class: 'CatalystToggleMixin',
    scope: packageInfo.name.substring(0, packageInfo.name.lastIndexOf('/')),
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
    path: 'tasks',
  },

  temp: {
    path: 'tmp'
  },

  package: packageInfo
};