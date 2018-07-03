const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const rename = require('gulp-rename')
const watchSass = require('gulp-watch-sass')
const fileInclude = require('gulp-file-include')
const bro = require('gulp-bro')
const babelify = require('babelify')
const tinyify = require('tinyify')
const imagemin = require('gulp-imagemin')

const cssSource = './src/scss/**/*.{scss, sass, css}'
const cssDest = './dist/css'
const htmlSource = './src/*.html'
const htmlDest = './dist'
const jsSource = './src/js/**/*.js'
const jsEntry = './src/js/main.js' // Define a single or series of entry files
const jsDest = './dist/js'

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
  gulp
    .src(htmlSource)
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: './src'
      })
    )
    .pipe(gulp.dest(htmlDest))
})

gulp.task('html:dev', () => {
  gulp
    .src(htmlSource)
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: './src'
      })
    )
    .pipe(gulp.dest(htmlDest))
})

gulp.task('html:watch', ['html:dev'], () => {
  gulp.watch(htmlSource, ['html:dev'])
})

gulp.task('js', () => {
  gulp
    .src(jsEntry)
    .pipe(
      bro({
        plugin: [tinyify],
        transform: [babelify.configure({ presets: ['@babel/preset-es2015'] })]
      })
    )
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(jsDest))
})

gulp.task('js:dev', () => {
  gulp.src(jsEntry).pipe(bro()).pipe(gulp.dest(jsDest))
})

gulp.task('js:watch', ['js:dev'], () => {
  gulp.watch(jsSource, ['js:dev'])
})

gulp.task('move', () =>
  gulp
    .src(['./src/*/*', '!./src/{js,scss,img,inc}/**/*'])
    .pipe(gulp.dest('./dist'))
)

gulp.task('move:watch', () => {
  return gulp.watch(['./src/*/*', '!./src/{js,scss,img,inc}/**/*'], ['move'])
})

gulp.task('images', () =>
  gulp
    .src('./src/img/**/*')
    .pipe(
      imagemin([
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: false }]
        })
      ])
    )
    .pipe(gulp.dest('./dist/img'))
)

gulp.task('default', ['css', 'html', 'js', 'move'])
gulp.task('dev', ['css:dev', 'html:dev', 'js:dev', 'move'])
gulp.task('watch', ['css:watch', 'html:watch', 'js:watch', 'move:watch'])
