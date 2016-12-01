/**
 * This example:
 *  Uses the built-in BrowserSync server for HTML files
 *  Watches & compiles SASS files
 *  Watches & injects CSS files
 */
var browserSync   = require('browser-sync');
var gulp          = require('gulp');
var sass          = require('gulp-sass');
var filter        = require('gulp-filter');
var uglify        = require('gulp-uglify');
var concat        = require('gulp-concat');
var ngmin         = require('gulp-ngmin');
var notify        = require('gulp-notify');
var minifyCss     = require('gulp-minify-css');
var autoprefixer  = require('gulp-autoprefixer');
var rename        = require('gulp-rename');
var clean         = require('gulp-clean');
var cache         = require('gulp-cache');
var imagemin      = require('gulp-imagemin');
var sourcemaps    = require('gulp-sourcemaps');
var	plumber       = require('gulp-plumber');


//init reload brower
var reload      = browserSync.reload;


// Set Browser-sync task, serve files into default nav
gulp.task('browser-sync', function() {
    browserSync({
        port: 8080,
        server: {
            baseDir: './',
            index: 'index.html'
        }
    });
});

// reload a server
gulp.task('browser-reload', function (){
  reload({stream:true});
});

// Clean log, comments, remove old files
gulp.task('clean', function() {
  return gulp.src(['./dist/css', './dist/js', './dist/images'], {read: false})
    .pipe(clean());
});

// Sass task, will run when any SCSS files change.
gulp.task('css', function() {
  return gulp.src('./src/scss/main.scss')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(notify("Style Modifié"))
    .pipe(reload({stream:true}));
});

//For js
gulp.task('js', function() {
  return gulp.src(['./src/js/app.js'])
  .pipe(plumber({
    errorHandler: notify.onError("Error: <%= error.message %>")
  }))
    .pipe(concat('app.min.js'))
    .pipe(ngmin())
    .pipe(uglify()) //minify js
    .pipe(gulp.dest('./dist/js'))
    .pipe(notify("JS Modifié"))
    .pipe(reload({stream:true}));
});


// Images
gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(reload({stream:true}))
    .pipe(gulp.dest('dist/img'))
    .pipe(notify({ message: 'Images compressées' }));
});


// Default task to be run with `gulp`
gulp.task('default', ['css', 'js', 'browser-sync'], function () {
    gulp.watch('src/scss/*.scss', ['css']);
    gulp.watch('src/img/', ['images']);
    gulp.watch(['src/js/*.js', 'src/js/controllers/*.js'], ['js']);
    gulp.watch(['**/*.html']).on('change', browserSync.reload);
});
