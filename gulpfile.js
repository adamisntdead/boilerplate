const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const rename = require('gulp-rename')
const watchSass = require('gulp-watch-sass')
const fileInclude = require('gulp-file-include')

const cssSource = './src/scss/**/*.{scss, sass, css}'
const cssDest = './dist/css'
const htmlSource = './src/*.html'
const htmlDest = './dist'

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

gulp.task('html', () => {
  gulp.src(htmlSource)
  .pipe(fileInclude({
    prefix: '@@',
    basepath: './src'
  }))
  .pipe(gulp.dest(htmlDest))
})

gulp.task('html:dev', () => {
  gulp.src(htmlSource)
  .pipe(fileInclude({
    prefix: '@@',
    basepath: './src'
  }))
  .pipe(gulp.dest(htmlDest))
})

gulp.task('html:watch', ['html:dev'], () => {
  gulp.watch(htmlSource, ['html:dev'])
})


gulp.task('default', ['css', 'html'])
gulp.task('dev', ['css:dev', 'html:dev'])
gulp.task('watch', ['css:watch', 'html:watch'])