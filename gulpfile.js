// *************************************
//
//   Gulpfile
//
// *************************************
//
// Available tasks:
//   `gulp`
//   `gulp dev`
//   `gulp watch`
//   `gulp format`
//
// -------------------------------------
//   Modules
// -------------------------------------
//
// gulp                  : The streaming build system
// gulp-sass             : Compile Sass
// gulp-autoprefixer     : Prefix CSS
// gulp-csso             : Optimize CSS (clean, compress, restructure)
// gulp-rename           : Rename files
// gulp-watch-sass       : Watches for SASS modifications - with streaming
// gulp-file-include     : Include files in other files
// gulp-bro              : Javascript bundler with Browserify and incremental builds
// gulp-imagemin         : Minify PNG, JPEG, GIF and SVG images
// gulp-inline-imagesize : Inline the size of images into into html comments
// gulp-prettier         : Format javascript
// gulp-html-beautify    : Format HTML
// merge-stream          : Merge multiple gulp stream sources
// browser-sync          : Sync browser refresh & CSS repalcement with file system changes
// critical              : Inline render path critical css and async load the other css
// tinyify               : Javascript optimizer (minify, remove dead code, tree shake, collapse...)
// babelify              : Convert ES6/ESNext code to ES5
//
// -------------------------------------

const gulp = require('gulp')
const plugins = require('gulp-load-plugins')({
  lazy: true,
  overridePattern: false,
  pattern: '{critical,tinyify,babelify,browser-sync,merge-stream}'
})

const settings = {
  css: {
    source: 'src/scss/**/*.{scss, sass, css}',
    dest: 'dist/css'
  },
  html: {
    watch: 'src/**/*.html',
    source: 'src/*.html',
    dest: 'dist',
    formatting: {
      indent: 4,
      indent_char: ' ',
      wrap_line_length: 78,
      brace_style: 'expand',
      unformatted: ['sub', 'sup', 'b', 'i', 'u', 'span', 'quote', 'strong']
    }
  },
  js: {
    source: 'src/js/**/*.js',
    entry: 'src/js/main.js',
    dest: 'dist/js'
  }
}

// -------------------------------------
//   Task: CSS
// -------------------------------------

gulp.task('css', () => {
  return gulp
    .src(settings.css.source)
    .pipe(
      plugins
        .sass({
          includePaths: ['node_modules']
        })
        .on('error', plugins.sass.logError)
    )
    .pipe(plugins.autoprefixer())
    .pipe(gulp.dest(settings.css.dest)) // Pipe unminified
    .pipe(plugins.csso())
    .pipe(plugins.rename({ extname: '.min.css' }))
    .pipe(gulp.dest(settings.css.dest))
})

gulp.task('css:dev', () => {
  return gulp
    .src(settings.css.source)
    .pipe(
      plugins
        .sass({
          includePaths: ['node_modules']
        })
        .on('error', plugins.sass.logError)
    )
    .pipe(plugins.autoprefixer())
    .pipe(gulp.dest(settings.css.dest))
})

gulp.task('css:watch', () => {
  return plugins
    .watchSass(settings.css.source, {
      includePaths: ['node_modules'],
      verbose: true
    })
    .pipe(
      plugins
        .sass({
          includePaths: ['node_modules']
        })
        .on('error', plugins.sass.logError)
    )
    .pipe(plugins.autoprefixer())
    .pipe(gulp.dest(settings.css.dest))
    .pipe(plugins.browserSync.reload({ stream: true }))
})

gulp.task('critical', () =>
  gulp
    .src('dist/*.html')
    .pipe(
      plugins.critical.stream({
        base: 'dist/',
        inline: true,
        css: ['dist/css/styles.min.css']
      })
    )
    .on('error', err => {
      console.error(err.message)
    })
    .pipe(gulp.dest('dist'))
)

// -------------------------------------
//   Task: HTML
// -------------------------------------

gulp.task('html', () => {
  // sources to inject script/link tags for
  const source = gulp.src([`${settings.css.dest}/*.min.css`, `${settings.js.dest}/*.min.js`])

  return gulp
    .src(settings.html.source)
    .pipe(
      plugins.fileInclude({
        prefix: '@@',
        basepath: 'src'
      })
    )
    .pipe(plugins.inlineImagesize())
    .pipe(plugins.htmlBeautify(settings.html.formatting))
    .pipe(
      plugins.inject(source, {
        addRootSlash: true,
        ignorePath: 'dist'
      })
    )
    .pipe(gulp.dest(settings.html.dest))
})

gulp.task('html:dev', () => {
  const source = gulp.src([
    `${settings.css.dest}/*.css`,
    `${settings.js.dest}/*.js`,
    `!${settings.css.dest}/*.min.css`,
    `!${settings.js.dest}/*.min.js`
  ])
  return gulp
    .src(settings.html.source)
    .pipe(
      plugins.fileInclude({
        prefix: '@@',
        basepath: 'src'
      })
    )
    .pipe(
      plugins.inject(source, {
        addRootSlash: true,
        ignorePath: 'dist'
      })
    )
    .pipe(gulp.dest(settings.html.dest))
})

gulp.task('html:format', () => {
  return gulp
    .src(settings.html.source)
    .pipe(plugins.htmlBeautify(settings.html.formatting))
    .pipe(gulp.dest('src'))
})

gulp.task('html:watch', () => gulp.watch(settings.html.watch, gulp.series('html:dev')))

// -------------------------------------
//   Task: JS
// -------------------------------------

gulp.task('js', () =>
  gulp
    .src(settings.js.entry)
    .pipe(
      plugins.bro({
        plugin: [plugins.tinyify],
        transform: [plugins.babelify.configure({ presets: ['@babel/preset-es2015'] })]
      })
    )
    .pipe(plugins.rename({ extname: '.min.js' }))
    .pipe(gulp.dest(settings.js.dest))
)

gulp.task('js:dev', () =>
  gulp
    .src(settings.js.entry)
    .pipe(plugins.bro())
    .pipe(gulp.dest(settings.js.dest))
)

gulp.task('js:format', () => {
  return gulp
    .src('src/**/*.js')
    .pipe(plugins.prettier({ singleQuote: true }))
    .pipe(gulp.dest('src'))
})

gulp.task('js:watch', () => gulp.watch(settings.js.source, gulp.series('js:dev')))

// -------------------------------------
//   Task: Move
// -------------------------------------

gulp.task('move', () => {
  const nonProcessed = gulp.src(['src/*/*', '!src/{js,scss,img,inc}/**/*']).pipe(gulp.dest('dist'))

  const vendor = gulp.src('src/**/vendor/**/*').pipe(gulp.dest('dist'))

  return plugins.mergeStream(nonProcessed, vendor)
})

gulp.task('move:watch', () =>
  gulp.watch(['src/*/*', '!src/{js,scss,img,inc}/**/*'], gulp.series('move'))
)

// -------------------------------------
//   Task: Images
// -------------------------------------

gulp.task('images', () =>
  gulp
    .src('src/img/**/*')
    .pipe(
      plugins.imagemin([
        plugins.imagemin.jpegtran({ progressive: true }),
        plugins.imagemin.optipng({ optimizationLevel: 3 }),
        plugins.imagemin.svgo({
          plugins: [{ removeViewBox: false }]
        })
      ])
    )
    .pipe(gulp.dest('dist/img'))
)

gulp.task('images:dev', () => gulp.src('src/img/**/*').pipe(gulp.dest('dist/img')))

gulp.task('images:watch', () =>
  gulp.watch('src/img/**/*').on('change', path => {
    gulp
      .src(path)
      .pipe(
        plugins.imagemin([
          plugins.imagemin.jpegtran({ progressive: true }),
          plugins.imagemin.optipng({ optimizationLevel: 3 }),
          plugins.imagemin.svgo({
            plugins: [{ removeViewBox: false }]
          })
        ])
      )
      .pipe(gulp.dest('dist/img'))
  })
)

// -------------------------------------
//   Task: browser-sync
// -------------------------------------

gulp.task('browser-sync', () => {
  plugins.browserSync.init({ server: { baseDir: 'dist', directory: true } })

  gulp.watch('dist/**/*').on('change', plugins.browserSync.reload)
})

// -------------------------------------
//   Task: Default
// -------------------------------------
// This talk involves compiling the html, css and javascript,
// moving fonts and other static assets and then optimizing images

gulp.task('default', gulp.series(gulp.parallel('css', 'js', 'move'), 'html', 'images'))
// gulp.task('default', ['css', 'html', 'js', 'move', 'images']);

// -------------------------------------
//   Task: Dev
// -------------------------------------

gulp.task('dev', gulp.parallel('css:dev', 'html:dev', 'js:dev', 'move', 'images:dev'))

// -------------------------------------
//   Task: Watch
// -------------------------------------

gulp.task(
  'watch',
  gulp.series(
    'dev',
    gulp.parallel(
      'css:watch',
      'html:watch',
      'js:watch',
      'move:watch',
      'images:watch',
      'browser-sync'
    )
  )
)

// -------------------------------------
//   Task: Format
// -------------------------------------

gulp.task('format', gulp.parallel('js:format', 'html:format'))
