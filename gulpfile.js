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
    ngAn = require('gulp-ng-annotate'),
    eslint = require('gulp-eslint'),
    mocha = require('gulp-mocha'),
    glob = require('glob'),
    karma = require('gulp-karma'),
    shell = require('gulp-shell'),
    gulp = require('gulp');

var liveReload = true,

    cssVendor = ['./vendor/bootstrap/dist/css/bootstrap.css',
                './vendor/bootstrap/dist/css/bootstrap-theme.css'],

    cssApp = ['./app/temp/css/styles.css'],

    cssFiles = cssVendor.concat(cssApp),

    fonts = ['./vendor/bootstrap/dist/fonts/**/*'],

    delStyles = ['./app/public/dist/css'],

    delFonts = ['./app/public/dist/fonts'],

    delCss = ['./app/temp/css'];


function genAppCss()
{
  var str = '';

  for(var i = 0; i < cssFiles.length; i++){
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

gulp.task('browserify-tests', function() {
  var bundler = browserify();
  glob.sync('./app/tests/unit/**/*.js')
  .forEach(function(file) {
    bundler.add(file, { debug: true });
  });
  return bundler
  .bundle()
  .pipe(source('browserified_tests.js'))
  .pipe(gulp.dest('./app/temp/tests'));
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
      .pipe(gulp.dest('./app/temp/css'));
});

gulp.task('sass',['clean:sass'],function(){
  return gulp.src('./app/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
        .pipe(gulp.dest('./app/temp/css'));

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

gulp.task('ng-an',[],function(){
  return gulp.src([
    'app/js/**/*.js'
  ])
  .pipe(ngAn())
  .pipe(gulp.dest('./app/temp/ng-an'));
});

gulp.task('lint', function() {
  return gulp.src([
    'gulpfile.js',
    'app/js/**/*.js',
    'app/tests/**/*.js',
  ])
  .pipe(eslint())
  .pipe(eslint.format());
});

gulp.task('unit',function(){
  return gulp.src([
    'app/tests/unit/**/*.js'
  ])
  .pipe(mocha({reporter: 'dot'}));
});

gulp.task('karma', ['browserify-tests'], function() {
  return gulp
  .src('./app/temp/tests/browserified_tests.js')
  .pipe(karma({
    configFile: 'karma.conf.js',
    action: 'run'
  }))
  .on('error', function(err) {
    // Make sure failed tests cause gulp to exit non-zero
    throw err;
  });
});

gulp.task('docs', shell.task([
    'node '+
    path.normalize('./node_modules/jsdoc/jsdoc.js ')+
    '-c '+path.normalize('./node_modules/angular-jsdoc/common/conf.json ')+   // config file
    '-t '+path.normalize('./node_modules/angular-jsdoc/angular-template ')+   // template file
    '-d docs '+                           // output directory
    path.normalize('./Readme.md ') +                            // to include README.md as index contents
    '-r ' + path.normalize('./app/js')                    // source code directory
]));

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
