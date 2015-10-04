'use strict';

var path = require('path');

var browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concatCss = require('gulp-concat-css'),
    file = require('gulp-file'),
    gulp = require('gulp');
    
var liveReload = false;
var cssFiles = ['./vendor/bootstrap/dist/css/bootstrap.css',
                './vendor/bootstrap/dist/css/bootstrap-theme.css',
                './app/dist-css/styles.css'];

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
    .pipe(gulp.dest('./app/dist-css'));
});

gulp.task('sass',function(){
  gulp.src('./app/sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
    .pipe(gulp.dest('./app/dist-css'));
});

gulp.task('styles-debug',['sass-debug'],function(){
  
  var str = '';
  
  for(var i=0;i<cssFiles.length;i++){
    str += '@import url(\'./' + path.basename(cssFiles[i]) + '\');\n';
  }
  
  gulp.src(cssFiles)
    .pipe(file('app.css',str))
    .pipe(gulp.dest('./app/public/dist/css'));
  
  gulp.src('./vendor/bootstrap/dist/fonts/**/*')
    .pipe(gulp.dest('./app/public/dist/fonts')); 
});



