const { src, dest, series, parallel, watch } = require('gulp');
const fs = require('fs/promises');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

const paths = {
  html: 'src/**/*.html',
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  assets: 'src/assets/**/*',
  dist: 'dist',
};

const clean = () => fs.rm(paths.dist, { recursive: true, force: true });

const html = () => src(paths.html).pipe(dest(paths.dist)).pipe(browserSync.stream());

const styles = () =>
  src('src/scss/main.scss')
    .pipe(sass({ quietDeps: true, silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'mixed-decls'] }).on('error', sass.logError))
    .pipe(dest(`${paths.dist}/css`))
    .pipe(browserSync.stream());

const vendorCss = () =>
  src('node_modules/swiper/swiper-bundle.min.css').pipe(dest(`${paths.dist}/css`));

const vendorJs = () =>
  src([
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    'node_modules/swiper/swiper-bundle.min.js',
  ]).pipe(dest(`${paths.dist}/js`));

const js = () => src(paths.js).pipe(dest(`${paths.dist}/js`)).pipe(browserSync.stream());

const assets = () =>
  src(paths.assets, { encoding: false, allowEmpty: true })
    .pipe(dest(`${paths.dist}/assets`))
    .pipe(browserSync.stream());

const build = series(clean, parallel(html, styles, vendorCss, vendorJs, js, assets));

function serve() {
  browserSync.init({ server: paths.dist });
  watch(paths.html, html);
  watch(paths.scss, styles);
  watch(paths.js, js);
  watch(paths.assets, assets);
}

exports.clean = clean;
exports.build = build;
exports.dev = series(build, serve);
exports.default = build;
