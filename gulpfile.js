'use strict';

var browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    gulp = require('gulp');

gulp.task('browserify', function() {
  return browserify('./app/js/app.js',{ debug: true})
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./app/public/'))
  //.pipe(connect.reload());
});