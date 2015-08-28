/*
 * ==================
 *  Front-End Architecture
 * ==================
 *
 * Sass is compiled down to app.css
 * JS is compiled down to app.js
 * browsersync will autoreload/inject css, js
 */

var gulp         = require('gulp'),
    plumber      = require('gulp-plumber'),
    rename       = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    minifycss    = require('gulp-minify-css'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    reload       = browserSync.reload;


/*
 * ==================
 *  BrowserSync / Serve
 * ================== */
gulp.task('serve', ['sass'], function() {

  browserSync.init({
    proxy: 'tuts.dev',
    ghostMode: false,
    open: false,
    notify: false
  });

  gulp.watch(['../*.php', '../**/*.php', '../*.html', '../**/*.html']).on('change', browserSync.reload);
  gulp.watch(['sass/*.scss', 'sass/**/*.scss'], ['sass']);
  gulp.watch(['js/*.js','js/**/*.js'], ['scripts']);
});


/*
 * ==================
 *  Sass/CSS
 * ================== */
 gulp.task('sass', function() {
  return gulp.src(['sass/site.scss'])
    .pipe(sass().on('error', function (err) {
      sass.logError(err);
      this.emit('end');
    }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('../public/css/'))
    .pipe(browserSync.stream())
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('../public/css/'));
});


/*
 * ==================
 *  JS
 * ================== */
gulp.task('scripts', function(){
  // Site
  return gulp.src([
    'js/helpers.js',
    'js/vendor/*.js',
    'js/modules/*.js',
    'js/site.js'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('site.js'))
    .pipe(gulp.dest('../public/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('../public/js/'))
    .pipe(browserSync.stream());
});


/*
 * ==================
 *  Put all together!
 * ================== */
 gulp.task('default', ['serve']);
