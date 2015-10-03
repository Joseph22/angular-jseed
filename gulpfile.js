'use strict';

var browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    connect = require('gulp-connect'),
    gulp = require('gulp');

var liveReload = false;

gulp.task('browserify', function() {
  return browserify('./app/js/app.js',{ debug: true})
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./app/public/'))
  //.pipe(connect.reload());
});

gulp.task('server',['browserify'],function(){
  connect.server({
    root: 'app/public',
    livereload: liveReload
  });
});