'use strict';

// General
const gulp = require('gulp');
const newer = require('gulp-newer');
const multipipe = require('multipipe');
const rename = require('gulp-rename');
const rimraf = require('rimraf');

// Styles
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');

sass.compiler = require('node-sass');

//Scripts
const uglify = require('gulp-uglify');

//Html
const pug = require('gulp-pug');

// BrowserSync
const browserSync = require('browser-sync').create();

// Paths to project folders
const paths = {
    input: 'src/',
    output: 'public/',
    scripts: {
        input: 'src/js/*.js',
        output: 'public/js/',
        watch: 'src/js/**/*.js'
    },
    styles: {
        input: 'src/styles/**/*.scss',
        output: 'public/css/',
        watch: 'src/styles/**/*.*'
    },
    assets: {
        input: 'src/assets/**/*.*',
        output: 'public/assets/',
        watch: 'src/assets/**/*.*'
    },
    html: {
        input: 'src/*.pug',
        output: 'public/',
        watch: 'src/**/*.pug'
    }
};

// Tasks
gulp.task('styles', function () {
    const plugins = [
        autoprefixer(),
        cssnano()
    ];
    return multipipe(
        gulp.src(paths.styles.input),
        sass(),
        postcss(plugins),
        concat('style.css'),
        rename({suffix: '.min'}),
        gulp.dest(paths.styles.output)
    );
});

gulp.task('scripts', function () {
    return multipipe(
        gulp.src(paths.scripts.input),
        concat('main.js'),
        rename({ suffix: '.min' }),
        uglify(),
        gulp.dest(paths.scripts.output)
    );
});

gulp.task('assets', function(){
    return gulp.src(paths.assets.input, {since: gulp.lastRun('assets')})
        .pipe(newer(paths.assets.output))
        .pipe(gulp.dest(paths.assets.output));
});

gulp.task('pug', function() {
    return multipipe(
        gulp.src(paths.html.input),
        pug({}),
        gulp.dest(paths.html.output)
    );
});

gulp.task('clean', function (callback) {
    return rimraf(paths.output, callback)
});

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('styles', 'scripts', 'assets', 'pug'))
);

gulp.task('watch', function () {
    gulp.watch(paths.styles.watch, gulp.series('styles'));
    gulp.watch(paths.scripts.watch, gulp.series('scripts'));
    gulp.watch(paths.assets.watch, gulp.series('assets'));
    gulp.watch(paths.html.watch, gulp.series('pug'));
});

gulp.task('serve', function () {
    browserSync.init({
        server: 'public'
    });
    browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev',
    gulp.series('build',
        gulp.parallel('watch', 'serve'))
);

// Default task
gulp.task('default',
    gulp.series ('dev', 'serve'));
