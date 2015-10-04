'use strict';

var browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    gulp = require('gulp');

var liveReload = false;

gulp.task('browserify', function() {
  return browserify('./app/js/app.js',{ debug: true})
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./app/public/dist/js'))
  //.pipe(connect.reload());
});

gulp.task('server',['browserify','sass-debug'],function(){
  connect.server({
    root: 'app/public',
    livereload: liveReload
  });
});

gulp.task('sass-debug',function(){
  gulp.src('./app/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error',sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/public/dist/css'));
});

gulp.task('sass',function(){
  gulp.src('./app/sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
    .pipe(gulp.dest('./app/public/dist/css'));
});