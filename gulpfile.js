/* eslint-disable */

const fs = require('fs');
const path = require('path');
const url = require('url');
const pug = require('pug');
const gulpPug = require('gulp-pug');
const pretty = require('pretty');
const gulpJsbeautifier = require('gulp-jsbeautifier');
const { argv } = require('yargs');
const w3cjs = require('gulp-w3cjs');

const del = require('del');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const rtlcss = require('gulp-rtlcss');
const cleanCSS = require('gulp-clean-css');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');

const { reload } = browserSync;
const Promise = require('promise');

/*-----------------------------------------------
|   Config
-----------------------------------------------*/
const domainLock = 'prium.github.io';

/*-----------------------------------------------
|   Paths
-----------------------------------------------*/
const CSS = 'pages/assets/css';
const JS = 'pages/assets/js';
const lib = 'pages/assets/lib';
const Paths = {
  HERE: './',
  PAGES: {
    FOLDER: 'pages',
    ALL: 'pages/**/*.*',
    HTML: 'pages/**/*.html',
  },
  JS: {
    ALL: 'js/**/*.js',
    BOOTSTRAP: [
      './js/bootstrap/util.js',
      './js/bootstrap/alert.js',
      './js/bootstrap/button.js',
      './js/bootstrap/carousel.js',
      './js/bootstrap/collapse.js',
      './js/bootstrap/dropdown.js',
      './js/bootstrap/modal.js',
      './js/bootstrap/tooltip.js',
      './js/bootstrap/popover.js',
      './js/bootstrap/scrollspy.js',
      './js/bootstrap/tab.js',
      './js/bootstrap/toast.js',
    ],
    THEME: [
      'js/theme/Utils.js',
      'js/theme/**/!(Utils)*.js',
    ],
    PLUGINS: ['js/plugins/all.min.js'],
  },
  SCSS: {
    ALL: 'scss/**/*.scss',
    THEME: 'scss/theme.scss',
  },
  ASSETS: {
    ALL: 'pages/assets/**/*.*',
    FONTS: 'pages/assets/fonts/**/*.*',
    VIDEO: 'pages/assets/video/**/*.*',
    IMG: 'pages/assets/img/**/*.*',
    JS: 'pages/assets/js',
  },
  CSS: 'pages/assets/css',
  DEPENDENCIES: {
    jquery: {
      FROM: 'node_modules/jquery/dist/jquery.min.js',
      TO: JS,
    },
    popper: {
      FROM: 'node_modules/popper.js/dist/umd/popper.min.js',
      TO: JS,
    },
    'bootstrap-js': {
      FROM: 'node_modules/bootstrap/js/dist/!(index)*.js',
      TO: 'js/bootstrap',
    },
    'bootstrap-scss': {
      FROM: 'node_modules/bootstrap/scss/**/*.scss',
      TO: 'scss/bootstrap',
    },
    prismjs: {
      FROM: ['node_modules/prismjs/prism.js', 'node_modules/prismjs/themes/prism-okaidia.css'],
      TO: lib,
    },
    stickyfilljs: {
      FROM: 'node_modules/stickyfilljs/dist/stickyfill.min.js',
      TO: lib,
    },
    'jquery-countdown': {
      FROM: 'node_modules/jquery-countdown/dist/jquery.countdown.min.js',
      TO: lib,
    },
    'sticky-kit': {
      FROM: 'node_modules/sticky-kit/dist/**/*.*',
      TO: lib,
    },
    'chart.js': {
      FROM: ['node_modules/chart.js/dist/Chart.min.js', 'node_modules/chart.js/dist/Chart.bundle.min.js'],
      TO: lib,
    },
    '@fortawesome': {
      FROM: 'node_modules/@fortawesome/fontawesome-free/js/all.min.js',
      TO: lib,
    },
    'progressbar.js': {
      FROM: 'node_modules/progressbar.js/dist/progressbar.min.js',
      TO: lib,
    },
    toastr: {
      FROM: 'node_modules/toastr/build/**/*.*',
      TO: lib,
    },
    fancybox: {
      FROM: 'node_modules/@fancyapps/fancybox/dist/**/*.*',
      TO: lib,
    },
    plyr: {
      FROM: 'node_modules/plyr/dist/**/*.*',
      TO: lib,
    },
    remodal: {
      FROM: 'node_modules/remodal/dist/**/*.*',
      TO: lib,
    },
    'jquery.mb.ytplayer': {
      FROM: ['node_modules/jquery.mb.ytplayer/dist/css/jquery.mb.YTPlayer.min.css', 'node_modules/jquery.mb.ytplayer/dist/jquery.mb.YTPlayer.min.js'],
      TO: lib,
    },
    'owl.carousel': {
      FROM: ['node_modules/owl.carousel/dist/owl.carousel.js', 'node_modules/owl.carousel/dist/assets/owl.carousel.css'],
      TO: lib,
    },
    lightbox2: {
      FROM: 'node_modules/lightbox2/dist/**/*.*',
      TO: lib,
    },
    datatables: {
      FROM: 'node_modules/datatables/media/**/*.*',
      TO: lib,
    },
    'datatables-bs4': {
      FROM: ['node_modules/datatables.net-bs4/js/dataTables.bootstrap4.min.js', 'node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css'],
      TO: lib,
    },
    'datatables.net-responsive': {
      FROM: ['node_modules/datatables.net-responsive/js/dataTables.responsive.js'],
      TO: lib,
    },
    'datatables.net-responsive-bs4': {
      FROM: ['node_modules/datatables.net-responsive-bs4/js/responsive.bootstrap4.js', 'node_modules/datatables.net-responsive-bs4/css/responsive.bootstrap4.css'],
      TO: lib,
    },
    'typed.js': {
      FROM: 'node_modules/typed.js/lib/typed.js',
      TO: lib,
    },
    flatpickr: {
      FROM: ['node_modules/flatpickr/dist/flatpickr.min.css','node_modules/flatpickr/dist/flatpickr.min.js'],
      TO: lib,
    },
    select2: {
      FROM: ['node_modules/select2/dist/css/select2.min.css','node_modules/select2/dist/js/select2.min.js'],
      TO: lib,
    },
    jqvmap: {
      FROM: 'node_modules/jqvmap/dist/**/*.*',
      TO: lib,
    },
    'semantic-ui-accordion': {
      FROM: ['node_modules/semantic-ui-accordion/accordion.min.css', 'node_modules/semantic-ui-accordion/accordion.min.js'],
      TO: lib,
    },
    'semantic-ui-transition': {
      FROM: ['node_modules/semantic-ui-transition/transition.min.css', 'node_modules/semantic-ui-transition/transition.min.js'],
      TO: lib,
    },
    tinymce: {
      FROM: 'node_modules/tinymce/**/*.*',
      TO: lib,
    },
  },
  GENERATED: [
    'js/bootstrap',
    'scss/bootstrap',
    'pages/assets/css',
    'pages/assets/js',
    'pages/**/*.html',
    'temp',
  ],
};


/*-----------------------------------------------
|   Cleaning
-----------------------------------------------*/
gulp.task('clean', () => del(Paths.GENERATED, { force: true }));


/*-----------------------------------------------
|   SCSS
-----------------------------------------------*/
gulp.task('scss', () => gulp.src(Paths.SCSS.THEME)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'expanded',
  }).on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false,
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(plumber.stop())
  .pipe(gulp.dest(Paths.CSS))
  .pipe(browserSync.stream()));

gulp.task('scss:min', () => gulp.src(Paths.SCSS.THEME)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'expanded',
  }).on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false,
  }))
  .pipe(cleanCSS({ compatibility: 'ie9' }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(sourcemaps.write('.'))
  .pipe(plumber.stop())
  .pipe(gulp.dest(Paths.CSS))
  .pipe(browserSync.stream()));

gulp.task('scss:rtl', () => gulp.src(Paths.SCSS.THEME)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'expanded',
  }).on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false,
  }))
  .pipe(rtlcss()) // Convert to RTL.
  .pipe(rename({ suffix: '-rtl' })) // Append "-rtl" to the filename.
  .pipe(sourcemaps.write('.'))
  .pipe(plumber.stop())
  .pipe(gulp.dest(Paths.CSS))
  .pipe(browserSync.stream()));

gulp.task('scss:rtl:min', () => gulp.src(Paths.SCSS.THEME)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'expanded',
  }).on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false,
  }))
  .pipe(rtlcss()) // Convert to RTL.
  .pipe(cleanCSS({ compatibility: 'ie9' }))
  .pipe(rename({ suffix: '-rtl.min' }))
  .pipe(sourcemaps.write('.'))
  .pipe(plumber.stop())
  .pipe(gulp.dest(Paths.CSS))
  .pipe(browserSync.stream()));


/*-----------------------------------------------
|   JavaScript
-----------------------------------------------*/
gulp.task('js:bootstrap', () => gulp.src(Paths.JS.BOOTSTRAP)
  .pipe(concat('bootstrap.js'))
  .pipe(replace(/^(export|import).*/gm, ''))
  .pipe(babel({
    compact: false,
    presets: [
      [
        'env', {
          modules: false,
          loose: true,
        },
      ],
    ],
    plugins: [
      process.env.PLUGINS && 'transform-es2015-modules-strip',
      '@babel/plugin-proposal-object-rest-spread',
    ].filter(Boolean),
  }))
  .pipe(gulp.dest(Paths.ASSETS.JS))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(gulp.dest(Paths.ASSETS.JS)));

gulp.task('js:theme', () => gulp.src(Paths.JS.THEME)
  .pipe(eslint({ fix: true }))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .pipe(concat('theme.js'))
  .pipe(replace(/^(export|import).*/gm, ''))
  .pipe(babel({
    compact: false,
    presets: [
      [
        'env',
        {
          modules: false,
          loose: true,
        },
      ],
    ],
    plugins: [
      process.env.PLUGINS && 'transform-es2015-modules-strip',
      '@babel/plugin-proposal-object-rest-spread',
      'transform-strict-mode',
    ].filter(Boolean),
  }))
  .pipe(gulp.dest(Paths.ASSETS.JS))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(gulp.dest(Paths.ASSETS.JS)));

gulp.task('js:plugins', () => gulp.src(Paths.JS.PLUGINS)
  .pipe(concat('plugins.js'))
  .pipe(replace(/^(export|import).*/gm, ''))
  .pipe(babel({
    compact: false,
    presets: [
      [
        'env', {
          modules: false,
          loose: true,
        },
      ],
    ],
    plugins: [
      process.env.PLUGINS && 'transform-es2015-modules-strip',
      '@babel/plugin-proposal-object-rest-spread',
    ].filter(Boolean),
  }))
  .pipe(gulp.dest(Paths.ASSETS.JS))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(gulp.dest(Paths.ASSETS.JS)));

gulp.task('js', gulp.parallel('js:bootstrap', 'js:plugins', 'js:theme'));


/*-----------------------------------------------
|   Dependencies
-----------------------------------------------*/
gulp.task('copy:dependency', () => {
  const promises = Object.keys(Paths.DEPENDENCIES).map(item => new Promise((resolve, reject) => {
    gulp.src(Paths.DEPENDENCIES[item].FROM)
      .pipe(gulp.dest((Paths.DEPENDENCIES[item].TO === lib) ? `${Paths.DEPENDENCIES[item].TO}/${item}` : Paths.DEPENDENCIES[item].TO))
      .on('end', (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      });
  }));
  return Promise.all(promises);
});


/*-----------------------------------------------
|   Watching
-----------------------------------------------*/
gulp.task('watch', () => {
  gulp.watch(Paths.SCSS.ALL, gulp.series('scss'));

  gulp.watch(Paths.PUG.FOLDER, gulp.series((done) => {
    reload();
    done();
  }));

  gulp.watch(Paths.JS.THEME, gulp.series('js:theme', (done) => {
    reload();
    done();
  }));

  gulp.watch(Paths.JS.PLUGINS, gulp.series('js:plugins', (done) => {
    reload();
    done();
  }));

  gulp.watch([Paths.ASSETS.FONTS, Paths.ASSETS.VIDEO, Paths.ASSETS.IMG], (done) => {
    reload();
    done();
  });
});


/*-----------------------------------------------
|   Compile PUG
-----------------------------------------------*/
/**
 * Browsersync middleware function
 * Compiles .pug files with browsersync
 */
Paths.PUG = {
  FOLDER: 'pug/**/*.pug',
  PAGES: 'pug/**/!(_)*.pug',
};

const compilePug = (req, res, next) => {
  const parsed = url.parse(req.url);

  if (parsed.pathname.match(/\.html$/) || parsed.pathname === '/') {

    let file = 'index';

    if (parsed.pathname !== '/') {
      file = parsed.pathname.substring(1, (parsed.pathname.length - 5));
    }

    // Todo: index fallback for subfolders
    let html = pug.renderFile(path.resolve(`./pug/${file}.pug`), { ENV: 'DEV', pretty: false, jsPretty : pretty });
    html = pretty(html, { ocd: false });

    html = html.replace(/\s*(<!-- end of)/g, '$1');

    fs.writeFileSync(`./pages/${file}.html`, html);

  }

  next();
};

/*-----------------------------------------------
|   Serve
-----------------------------------------------*/
gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: Paths.PAGES.FOLDER,
    },
    // proxy: '127.0.0.1:8010',
    port: 3000,
    open: true,
    notify: false,
    middleware: compilePug,
  });
});


/*-----------------------------------------------
|   Starting everything
-----------------------------------------------*/
gulp.task('default', gulp.series('clean', 'copy:dependency', 'scss', 'scss:rtl', 'js', gulp.parallel('watch', 'serve')));


/*-----------------------------------------------
|   Temp Task
-----------------------------------------------*/
gulp.task('temp', () => {
  const buffer = fs.readFileSync('./package.json');
  const packageJson = JSON.parse(buffer.toString());

  const promises = Object.keys(packageJson.dependencies)
    .map(item => new Promise((resolve, reject) => {
      gulp.src(`node_modules/${item}/**/*.*`)
        .pipe(gulp.dest(`temp/${item}`))
        .on('end', (err) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve();
          }
        });
    }));
  return Promise.all(promises);
});

const themePackage = require('./package.json');
const {name, version} = themePackage;
Paths.PRODUCT = {
  FROM: ['product/gulpfile.js', 'product/package.json', 'product/.gitignore', 'product/README.md', 'js/**/*.js', 'pages/**/*.*', 'scss/**/*.scss', '.eslintrc.json'],
  TO: `${name}-v${version}`,
};

gulp.task('pug2html', () => gulp.src(Paths.PUG.PAGES)
  .pipe(plumber())
  .pipe(gulpPug({
    pretty: true,
    locals: { ENV: 'PRODUCTION', jsPretty : pretty },
  }))
  .pipe(gulpJsbeautifier({
    unformatted: ['code', 'pre', 'em', 'strong', 'span'],
    indent_inner_html: true,
    indent_char: ' ',
    indent_size: 2,
    sep: '\n',
  }))
  .pipe(gulpJsbeautifier.reporter({
    verbosity: gulpJsbeautifier.report.ALL
  }))
  .pipe(plumber.stop())
  .pipe(gulp.dest(Paths.PAGES.FOLDER)));

gulp.task('product:push', () => {
  if (argv.dir) {
    Paths.PRODUCT.TO = argv.dir;
  }
  const promises = Paths.PRODUCT.FROM.map((item) => {
    let destination;
    if (item.split('/')[1] && item.split('/')[1].includes('*')) {
      destination = `${Paths.PRODUCT.TO}/${item.split('/')[0]}`;
    } else {
      destination = Paths.PRODUCT.TO;
    }
    return new Promise((resolve, reject) => gulp.src(item)
      .pipe(gulp.dest(destination))
      .on('end', (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      }));
  });
  return Promise.all(promises);
});

gulp.task('product', gulp.series('pug2html', 'product:push'));


/*-----------------------------------------------
|   Take Shot
-----------------------------------------------*/
const through = require('through2');
const puppeteer = require('puppeteer');
const ansi = require('ansi');
const vinylPaths = require('vinyl-paths');

const cursor = ansi(process.stdout);
let totalWaitingTime = 0;


const shotIt = async (page, fileName) => {

  cursor.hex('#00ffff').bold();
  console.log(`Preparing: ${fileName}`);
  cursor.reset();

  return new Promise(async (resolve, reject) => {
    try {
      await page.setUserAgent('puppeteer');

      cursor.hex('#ffff00').bold();
      console.log(`Opening: http://localhost:3000/${fileName}`);
      cursor.reset();

      await page.goto(`http://localhost:3000/${fileName}`);

      await page.addStyleTag({
        content:
          `
            .fancynavbar{ display:none; }
            .main, .footer { width: 100vw !important; }
            *[data-zanim-trigger]{ opacity: 1 !important; }
          `
      });

      await page.setViewport({
        height: 900,
        width: 1400,
      });

      const bodyHandle = await page.$('body');
      const { width, height } = await bodyHandle.boundingBox();

      const timeStart = Date.now();
      console.log('\tWaiting...');

      await page.waitFor(3000);
      const tWaiting = Date.now() - timeStart;
      console.log(`Waiting time: ${tWaiting}ms`);
      totalWaitingTime += tWaiting;

      cursor.hex('#ffffff').bold();
      console.log('\tTaking screenshot...');
      cursor.reset();
      const imgPath = `pages/assets/img/screenshots/${fileName.split('.html')[0]}.jpg`;
      await page.screenshot({
        clip: {
          x: 0,
          y: 0,
          width,
          height,
        },
        path: imgPath,
      });

      cursor.hex('#00ff00').bold();
      console.log(`\tShot Taken as ${fileName.split('.html')[0]}.jpg`);
      cursor.reset();

      await bodyHandle.dispose();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


gulp.task('through', () => {
  const array = [];
  return gulp.src('./pages/**.html')
    .pipe(through.obj((chunk, enc, cb) => {
      console.log(chunk.path);
      array.push(chunk.path.split('/')[chunk.path.split('/').length - 1]);
      cb(null, chunk);
    })).on('end', async () => {
      const startTime = Date.now();
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      for (const pageName of array) {
        try {
          await shotIt(page, pageName);
        } catch (err) {
          console.log('failed', pageName, err);
        }
      }

      await browser.close();
      console.log(`Total Waiting Time: ${totalWaitingTime / 1000}s`);
      console.log(`Total Process Time: ${(Date.now() - startTime) / 1000}s`);

    });
});

gulp.task('shot:rename', () => gulp.src('./pages/assets/img/screenshots/*.jpg')
  .pipe(vinylPaths(del))
  .pipe(rename({ prefix: 'dist--' }))
  .pipe(gulp.dest('./pages/assets/img/screenshots/')));

gulp.task('shot', gulp.series('pug2html', 'through'));
// End Shot


/*-----------------------------------------------
|   w3c validation for HTML
-----------------------------------------------*/
gulp.task('w3cjs', (done) => {
  let htmlfiles = 'pages/**/*.html';
  if (argv.html) {
    htmlfiles = `pages/${argv.html}.html`;
    cursor.hex('#00ffff').bold();
    console.log('html: ', htmlfiles);
    cursor.reset();
  }

  return gulp.src(htmlfiles)
    .pipe(w3cjs())
    .pipe(through.obj((file, enc, cb) => {
      console.log({url: file.history[0], ...(!file.w3cjs.success ? {...file.w3cjs} : {})});
      cb();
    }))
    .pipe(w3cjs.reporter())
    .on('end', () => {
      done();
    });
});

gulp.task('w3c', gulp.series('pug2html', 'w3cjs'));




/*-----------------------------------------------
|   Live Preview
-----------------------------------------------*/

const uglifyjs = require('gulp-uglify');
const javascriptObfuscator = require('gulp-javascript-obfuscator');
const htmlmin = require('gulp-htmlmin');

gulp.task('live:html', (done) => {
  return gulp.src(Paths.PUG.PAGES)
    .pipe(gulpPug({
      pretty: false,
      locals: { ENV: 'LIVE', jsPretty : pretty }
    }))
    .pipe(gulpJsbeautifier({
      unformatted: ['code', 'pre', 'em', 'strong', 'span'],
      indent_inner_html: true,
      indent_char: ' ',
      indent_size: 2,
      sep: '\n',
    }))
    // .pipe(htmlmin({
    //   collapseWhitespace: true,
    //   removeComments: true
    // }))
    .pipe(gulp.dest(`live`));
});

gulp.task('live:css', (done) => {
  return gulp.src('pages/assets/css/*.css')
  .pipe(cleanCSS({compatibility: '*'}))
  .pipe(gulp.dest(`live/assets/css/`));
});

gulp.task('live:js', (done) => {
  return gulp.src('pages/assets/js/*.js')
  .pipe(javascriptObfuscator({domainLock: [domainLock]}))
  .pipe(uglifyjs())
  .pipe(gulp.dest(`live/assets/js/`));
});



gulp.task('live:others', (done) => {
  return gulp.src(['pages/assets/**/*.*', '!pages/assets/css/*.*', '!pages/assets/js/*.*'])
  .pipe(gulp.dest(`live/assets`));
});


gulp.task('live', gulp.parallel('live:html', 'live:css', 'live:js' , 'live:others'));
