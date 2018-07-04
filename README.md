# Boilerplate

This is a build system boilerplate for frontend projects.
This is not for sites that use frameworks such as Vue, React or Angular.

## Features

* Sass
* Autoprefixer
* HTML Includes
* Minification
* JS Module Bundling
* Image Optimization
* Moves Everything To An Output Folder
* Adds Image Sizes To HTML Inline (for the backend developers!)
* Clean up your source code (HTML and JS)
* Live Reloading / Rebuilding

## What Are We Using?

* For the CSS - [csso](https://css.github.io/csso/csso.html), [sass](https://sass-lang.com/), [autoprefixer](https://github.com/postcss/autoprefixer)
* For the JS - [Babel](https://babeljs.io/), [Prettier](https://prettier.io/), [Browserify](http://browserify.org/), [Tinyify](https://github.com/browserify/tinyify)
* For the HTML - [gulp-html-beautify](https://www.npmjs.com/package/gulp-html-beautify), [gulp-inline-imagesize](https://www.npmjs.com/package/gulp-inline-imagesize)
* And some more - [imagemin](https://github.com/imagemin/imagemin)

## Usage

First install the dependencies:

```bash
$ npm install
```

Or if you float that way,

```bash
$ yarn
```

Then you can run the scripts.
There is 4 main tasks:

* `npm run dist` - Build the production version of the site (think minify and optimize)
* `npm run dev` - Build the development version of the site (think faster)
* `npm run watch` - Like `npm run dev` but it watches for changes and builds incrementally
* `npm run format` - Clean up your HTML and JS source code

## License

MIT