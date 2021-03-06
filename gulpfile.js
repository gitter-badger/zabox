var gulp = require('gulp');
var debug = require('gulp-debug');
var jasmine = require('gulp-jasmine');
var karma = require('gulp-karma');
var plumber = require('gulp-plumber');
var istanbul = require('gulp-istanbul');

var paths = {
  libs: ['lib/**/*.js'],
  tests: ['spec/**/*Spec.js'],
  frontendFiles: [ 'public/js/**/*.js' ],
  frontendTests: [ 'public/test/**/*.js' ]
};

gulp.task('jasmine', function () {
  return gulp.src(paths.tests)
    .pipe(plumber())
    .pipe(debug({title: 'jasmine:'}))
    .pipe(jasmine({verbose:true}));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.tests, ['test']);
  gulp.watch(paths.libs, ['test']);
});

gulp.task('jasmine-codecov', function(cb) {
  gulp.src(paths.libs)
    .pipe(plumber())
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(paths.tests)
        .pipe(plumber())
        .pipe(jasmine({verbose:true}))
        .pipe(istanbul.writeReports({dir: './coverage/backend'}))
        .on('end', cb);
    });
});

gulp.task('karma', function() {
  // Be sure to return the stream
  // NOTE: Using the fake './foobar' so as to run the files
  // listed in karma.conf.js INSTEAD of what was passed to
  // gulp.src !
  return gulp.src('./foobar')
    .pipe(plumber())
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) { throw err; });
});

gulp.task('test', ['jasmine'], function() {});
gulp.task('travis', ['jasmine-codecov','karma'], function() {});
