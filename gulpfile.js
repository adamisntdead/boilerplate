const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const rename = require('gulp-rename')
const watchSass = require('gulp-watch-sass')

const cssSource = './src/scss/**/*.{scss, sass, css}'
const cssDest = './dist/css'

gulp.task('css', () => {
  return gulp
    .src(cssSource)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(cssDest)) // Pipe unminified
    .pipe(csso())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(cssDest))
})

gulp.task('css:dev', () => {
  return gulp 
    .src(cssSource)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(cssDest))
})

gulp.task('css:watch', ['css:dev'], () => {
  return watchSass(cssSource, { verbose: true })
    .pipe(sass())
    .pipe(gulp.dest(cssDest))
})

gulp.task('default', ['css'])
gulp.task('dev', ['css:dev'])
gulp.task('watch', ['css:watch'])