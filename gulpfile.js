var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    uglify = require('gulp-uglify'),
    streamify = require('gulp-streamify'),
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS = require('gulp-minify-css'),
    connect = require('gulp-connect');

var env = process.env.NODE_ENV || 'development';

gulp.task('js', function() {
  return browserify('./src/js/main.js', { debug: env === 'development'})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulpif(env === 'production', streamify(uglify())))
        .pipe(gulp.dest('public/js'))
        .pipe(connect.reload())
});

gulp.task('sass', function() {
  return gulp.src('./src/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(gulpif(env === 'production', minifyCSS()))
        .pipe(gulpif(env === 'development', sourcemaps.write()))
        .pipe(gulp.dest('./public/css'))
        .pipe(connect.reload())
});

gulp.task('html', function() {
  return gulp.src('./index.html')
        .pipe(connect.reload())
});

gulp.task('connect', function() {
  connect.server({
    root: '.',
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/styles/**/*.scss', ['sass']);
  gulp.watch('./index.html', ['html']);
});


gulp.task('default', ['js', 'sass', 'watch', 'connect'])
