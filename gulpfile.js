var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    mocha = require('gulp-mocha');

var paths = {
  scripts: ['server/**/*.js'],
  specs: ['specs/*.js']
}

gulp.task('serverBuild', ['lint','test']);

gulp.task('lint', function(){
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(notify({message: 'Lint done'}));
});

gulp.task('test',function(){
  return gulp.src(paths.specs)
    .pipe(mocha());
});