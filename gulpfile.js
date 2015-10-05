'use strict';

var browserify = require('browserify'),
    del = require('del'),
    path = require('path'),
    source = require('vinyl-source-stream'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    file = require('gulp-file'),
    minifyCss = require('gulp-minify-css'),
    gulp = require('gulp');
    
var liveReload = true,
    
    cssVendor = ['./vendor/bootstrap/dist/css/bootstrap.css',
                './vendor/bootstrap/dist/css/bootstrap-theme.css'],

    cssApp = ['./app/dist-css/styles.css'],

    cssFiles = cssVendor.concat(cssApp),

    fonts = ['./vendor/bootstrap/dist/fonts/**/*'],

    delStyles = ['./app/public/dist/css'],

    delFonts = ['./app/public/dist/fonts'],

    delCss = ['./app/dist-css'];


function genAppCss()
{
  var str = '';
  
  for(var i=0;i<cssFiles.length;i++){
    str += '@import url(\'./' + path.basename(cssFiles[i]) + '\');\n';
  }
  
  return str;
}

//gulp Tasks

gulp.task('browserify', function() {
  return browserify('./app/js/app.js',{ debug: true})
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./app/public/dist/js'))
  .pipe(connect.reload());
});

gulp.task('clean:styles',function(){
   return del(delStyles);
});

gulp.task('clean:sass',function(){
   return del(delCss);
});

gulp.task('clean:fonts',function(){
   return del(delFonts);
});

gulp.task('sass:debug',['clean:sass'],function(){
  return gulp.src('./app/sass/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error',sass.logError))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./app/dist-css'));    
});

gulp.task('sass',['clean:sass'],function(){
  return gulp.src('./app/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
        .pipe(gulp.dest('./app/dist-css'));  
  
});

gulp.task('fonts',['clean:fonts'],function(){
  return gulp.src(fonts)
            .pipe(gulp.dest('./app/public/dist/fonts'));
});

gulp.task('styles:debug:all',['sass:debug',
                          'clean:styles',
                          'fonts'],function(){
  
  return gulp.src(cssFiles)
      .pipe(file('app.css',genAppCss()))
      .pipe(gulp.dest('./app/public/dist/css'));
  
});

gulp.task('styles:debug',['sass:debug'],function(){
  
  return gulp.src(cssApp)
      .pipe(file('app.css',genAppCss()))
      .pipe(gulp.dest('./app/public/dist/css'))
      .pipe(connect.reload());
});

gulp.task('styles',['sass',
                    'clean:styles',
                    'fonts'],function(){
  
  return gulp.src(cssFiles)
        .pipe(minifyCss())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./app/public/dist/css'));
});

gulp.task('build:debug:all',['browserify','styles:debug:all']);
gulp.task('build:debug',['browserify','styles:debug']);

gulp.task('server',['build:debug:all'],function(){
  connect.server({
    root: 'app/public',
    livereload: liveReload
  });
});

gulp.task('watch', function() {
  gulp.start('server');

  gulp.watch([
    'app/js/**/*.js'
    //,'test/**/*.js'
  ], ['browserify']);

  gulp.watch([
    'app/sass/**/*.scss'
  ], ['styles:debug']);

//  gulp.watch(['app/**/*.html',
//           '!app/js/vendor/**/*.html'], ['reload']);

});