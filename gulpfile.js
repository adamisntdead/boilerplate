const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const watchSass = require('gulp-watch-sass');
const fileInclude = require('gulp-file-include');
const bro = require('gulp-bro');
const babelify = require('babelify');
const tinyify = require('tinyify');
const imagemin = require('gulp-imagemin');
const inlineImagesize = require('gulp-inline-imagesize');
const prettier = require('gulp-prettier');
const htmlbeautify = require('gulp-html-beautify');
const merge = require('merge-stream');
const browserSync = require('browser-sync');

const settings = {
  css: { source: './src/scss/**/*.{scss, sass, css}', dest: './dist/css' },
  html: { source: './src/*.html', dest: './dist', indent: 4 },
  js: {
    source: './src/js/**/*.js',
    entry: './src/js/main.js',
    dest: './dist/js'
  }
};

gulp.task('css', () => {
  return gulp
    .src(settings.css.source)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(settings.css.dest)) // Pipe unminified
    .pipe(csso())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(settings.css.dest));
});

gulp.task('css:dev', () => {
  return gulp
    .src(settings.css.source)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(settings.css.dest));
});

gulp.task('css:watch', ['css:dev'], () => {
  return watchSass(settings.css.source, { verbose: true })
    .pipe(sass())
    .pipe(gulp.dest(settings.css.dest))
    .pipe(browserSync.stream());
});

gulp.task('html', () => {
  return gulp
    .src(settings.html.source)
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: './src'
      })
    )
    .pipe(inlineImagesize())
    .pipe(htmlbeautify({ indentSize: settings.html.indent }))
    .pipe(gulp.dest(settings.html.dest));
});

gulp.task('html:dev', () => {
  gulp
    .src(settings.html.source)
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: './src'
      })
    )
    .pipe(gulp.dest(settings.html.dest));
});

gulp.task('html:format', () => {
  return gulp
    .src(settings.html.source)
    .pipe(inlineImagesize())
    .pipe(htmlbeautify({ indentSize: settings.html.indent }))
    .pipe(gulp.dest('./src'));
});

gulp.task('html:watch', ['html:dev'], () => {
  gulp.watch(settings.html.source, ['html:dev']);
});

gulp.task('js', () => {
  gulp
    .src(settings.js.entry)
    .pipe(
      bro({
        plugin: [tinyify],
        transform: [babelify.configure({ presets: ['@babel/preset-es2015'] })]
      })
    )
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(settings.js.dest));
});

gulp.task('js:dev', () => {
  gulp
    .src(settings.js.entry)
    .pipe(bro())
    .pipe(gulp.dest(settings.js.dest));
});

gulp.task('js:format', () => {
  return gulp
    .src('./src/**/*.js')
    .pipe(prettier({ singleQuote: true }))
    .pipe(gulp.dest('./src'));
});

gulp.task('js:watch', ['js:dev'], () => {
  gulp.watch(settings.js.source, ['js:dev']);
});

gulp.task('move', () => {
  const nonProcessed = gulp
    .src(['./src/*/*', '!./src/{js,scss,img,inc}/**/*'])
    .pipe(gulp.dest('./dist'));

  const vendor = gulp.src('./src/**/vendor/**/*').pipe(gulp.dest('./dist'));

  return merge(nonProcessed, vendor);
});

gulp.task('move:watch', ['move'], () => {
  return gulp.watch(
    ['./src/*/*', '!./src/{js,scss,img,inc}/**/*'],
    ['move']
  );
});

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
);

gulp.task('images:dev', () =>
  gulp.src('./src/img/**/*').pipe(gulp.dest('./dist/img'))
);

gulp.task('images:watch', ['images:dev'], () =>
  gulp.watch('./src/img/**/*', ['images:dev'])
);

gulp.task('browser-sync', () => {
  browserSync.init({ server: { baseDir: './dist' } });

  gulp
    .watch(['./dist/**/*', '!./dist/**/*.css'])
    .on('change', browserSync.reload);
});
gulp.task('default', ['css', 'html', 'js', 'move', 'images']);
gulp.task('dev', ['css:dev', 'html:dev', 'js:dev', 'move', 'images:dev']);
gulp.task('watch', [
  'css:watch',
  'html:watch',
  'js:watch',
  'move:watch',
  'images:watch',
  'browser-sync'
]);
gulp.task('format', ['js:format', 'html:format']);
