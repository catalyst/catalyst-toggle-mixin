/* eslint-env node */

require('./tasks/clean.js');

require('./tasks/analyze');   // Task: analyze
require('./tasks/docs.js');   // Task: build-docs
require('./tasks/lint.js');   // Task: lint