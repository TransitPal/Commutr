var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    mocha = require('gulp-mocha'),
    shell = require('gulp-shell');
    nodemon = require('gulp-nodemon'),
    open = require('gulp-open');

var paths = {
  scripts: ['server/**/*.js'],
  specs: ['specs/*.js'],
  client: ['']
}

gulp.task('serverBuild', ['lint','test']);
gulp.task('default',['serverBuild', 'dbConnect', 'nodemon']);

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

gulp.task('dbConnect',function(){
  return gulp.src('*.js', {read: false})
    .pipe(shell([
      'mongod'
    ]));
});

gulp.task('nodemon',function(){
  nodemon({script:'server.js'})
    .on('restart', 'serverBuild')
});

gulp.task('view',function(){
  var options = {
    url: 'http://localhost:8080',
    app: 'google chrome'
  }
  gulp.src('server.js')
    .pipe(open('',options))
});

gulp.task('emulateIOS',function(){
  return gulp.src(paths.client)
    .pipe(shell([
      'cd client && ionic platform ios && ionic build ios && ionic emulate ios'
    ]));
});

gulp.task('emulateAndroid',function(){
  return gulp.src(paths.client)
    .pipe(shell([
      'cd client && ionic platform android && ionic build android && ionic emulate android'
    ]));
});

gulp.task('runAnd',function(){
  return gulp.src(paths.client)
    .pipe(shell([
      'cd client && ionic run android'
    ]));
});

gulp.task('runIos',function(){
  return gulp.src(paths.client)
    .pipe(shell([
      'cd client && ionic build ios && ionic emulate ios'
    ]));
});
