const { src, dest, series, parallel, watch } = require('gulp');
const fs = require('fs/promises');
const browserSync = require('browser-sync').create();

const paths = {
  html: 'src/**/*.html',
  css: 'src/css/**/*.css',
  js: 'src/js/**/*.js',
  assets: 'src/assets/**/*',
  dist: 'dist',
};

const clean = () => fs.rm(paths.dist, { recursive: true, force: true });

const html = () => src(paths.html).pipe(dest(paths.dist)).pipe(browserSync.stream());

const css = () =>
  src(['node_modules/bootstrap/dist/css/bootstrap.min.css', paths.css], { encoding: false })
    .pipe(dest(`${paths.dist}/css`))
    .pipe(browserSync.stream());

const js = () =>
  src(['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', paths.js], { encoding: false })
    .pipe(dest(`${paths.dist}/js`))
    .pipe(browserSync.stream());

const assets = () =>
  src(paths.assets, { encoding: false, allowEmpty: true })
    .pipe(dest(`${paths.dist}/assets`))
    .pipe(browserSync.stream());

const build = series(clean, parallel(html, css, js, assets));

function serve() {
  browserSync.init({ server: paths.dist });
  watch(paths.html, html);
  watch(paths.css, css);
  watch(paths.js, js);
  watch(paths.assets, assets);
}

exports.clean = clean;
exports.build = build;
exports.dev = series(build, serve);
exports.default = build;
