// Load config.
const config = require('./config.js');

// Libraries.
const gulp = require('gulp');
const eslint = require('gulp-eslint');

// Lint JS
gulp.task('lint:js', () => {
  return gulp
    .src([
      './*.js',
      `./${config.src.path}/**/*.js`,
      `./${config.tasks.path}/**/*.js`
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

// Lint the project
gulp.task('lint', gulp.parallel('lint:js'));
