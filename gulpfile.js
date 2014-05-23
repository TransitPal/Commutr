var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify');

var paths = {
  server: ['server/**/*.js']
}

gulp.task('serverBuild', ['lint','test']);

gulp.task('lint', function(){
  return gulp.src(paths.server)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(notify({message: 'Lint done'}));
});

gulp.task('test',function(){

});