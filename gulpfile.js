const gulp = require('gulp')
const sass = require('gulp-sass')
const watchSass = require('gulp-watch-sass')

const sassFiles = './src/scss/**/*.scss'

gulp.task('sass', () => gulp.src(sassFiles).pipe(sass()).pipe(gulp.dest('./dist/css')))

gulp.task('sass:watch', () =>
  watchSass(sassFiles)
    .pipe(sass())
    .pipe(gulp.dest('./dist/css'))
)

// The development task, will initially compile things
// and then watch for changes
gulp.task('watch', ['sass', 'sass:watch'])

// Build the production version of the assets
gulp.task('default', ['sass'])
