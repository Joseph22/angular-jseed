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
    protractor = require('gulp-protractor').protractor,
    glob = require('glob'),
    karma = require('karma').Server,
    shell = require('gulp-shell'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    gulp = require('gulp');

var liveReload = false,

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

gulp.task('clean:js',function(){
  return del([
    './app/public/dist/js'
  ]);
});

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
  .forEach(function(f) {
    bundler.add(f, { debug: true });
  });
  return bundler
  .bundle()
  .pipe(source('browserified_tests.js'))
  .pipe(gulp.dest('./app/temp/tests'));
});

gulp.task('clean:an',function(){
  return del([
    './app/temp/controllers',
    './app/temp/directives',
    './app/temp/filters',
    './app/temp/services',
    './app/temp/vendor-module',
    './app/temp/app.js'
  ]);
});

gulp.task('ng-an',['clean:an'], function(){
  return gulp.src([
    'app/js/**/*.js'
  ])
  .pipe(ngAn())
  .pipe(gulp.dest('./app/temp'));
});

gulp.task('browserify-min', ['ng-an'], function() {
  return browserify('./app/temp/app.js')
  .bundle()
  .pipe(source('app.js'))
  .pipe(streamify(uglify({ mangle: true })))
  .pipe(gulp.dest('./app/public/dist/js'));
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

gulp.task('lint', function() {
  return gulp.src([
    'gulpfile.js',
    'app/js/**/*.js',
    'app/tests/**/*.js',
  ])
  .pipe(eslint())
  .pipe(eslint.format());
});

gulp.task('test', ['browserify-tests'], function(done) {
  new karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('tdd', ['browserify-tests'], function(done) {
  gulp.watch([
    'app/tests/unit/**/*.js'
  ], ['browserify-tests']);

  new karma({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('docs', shell.task([
    'node ' +
    path.normalize('./node_modules/jsdoc/jsdoc.js ') +
    '-c ' + path.normalize('./node_modules/angular-jsdoc/common/conf.json ') +   // config file
    '-t ' + path.normalize('./node_modules/angular-jsdoc/angular-template ') +   // template file
    '-d docs ' +                           // output directory
    path.normalize('./Readme.md ') +                            // to include README.md as index contents
    '-r ' + path.normalize('./app/js')                    // source code directory
]));

gulp.task('e2e', ['server'], function() {
  return gulp.src([])
  .pipe(protractor({
    configFile: 'protractor.conf.js',
    args: ['--baseUrl', 'http://127.0.0.1:8080'],
  }))
  .on('error', function(e) { throw e; })
  .on('end', function() {
    connect.serverClose();
  });
});

gulp.task('clean',['clean:js','clean:an','clean:styles','clean:sass','clean:fonts']);
gulp.task('build:debug:all',['browserify','styles:debug:all']);
gulp.task('build:debug',['browserify','styles:debug']);
gulp.task('default',['browserify-min', 'styles']);

gulp.task('server',['build:debug:all'],function(){
  connect.server({
    root: 'app/public',
    livereload: liveReload
  });
});

gulp.task('server-min',['default'],function(){
  connect.server({
    root: 'app/public',
    livereload: liveReload
  });
});

gulp.task('watch', function() {
  liveReload = true;
  gulp.start('server');

  gulp.watch([
    'app/js/**/*.js'
    //,'test/**/*.js'
  ], ['browserify']);

  gulp.watch([
    'app/sass/**/*.scss'
  ], ['styles:debug']);

});
