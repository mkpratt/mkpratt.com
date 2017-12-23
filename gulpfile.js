'use strict';

const gulp      = require('gulp');
const uglify    = require('uglify-es');
const composer  = require('gulp-uglify/composer');
const rename    = require('gulp-rename');
const clean     = require('gulp-clean');
const minifycss = require('gulp-minify-css');
const gulputil  = require('gulp-util');
const pump      = require('pump');

let minify = composer(uglify, console);

gulp.task('scripts', function(cb) {
    let base = 'public/';
    let js_src = base + 'scripts/*.js';
    let js_dst = base + 'dist/scripts';    
    let options = {
        compress: {
            drop_console: false,
            unused: true
        },
        mangle: {
            eval: true,
            keep_fnames: false,
            toplevel: true
        }
    };
    pump([
        gulp.src(js_src),
        minify(options),
        rename({suffix: '.min'}),
        gulp.dest(js_dst)
    ], 
    cb);
});

// gulp.task('css', function(cb) {
//     let css_src = 'app/styles/*.css';
//     let css_dst = 'dist/styles';
//     // return gulp.src(css_src)
//     //     .pipe(minifycss())
//     //     .pipe(gulp.dest(css_dst))
//     //     .on('error', gulputil.log);
//     pump([
//         gulp.src(css_src),
//         minifycss(),
//         gulp.dest(css_dst)
//     ], 
//     cb);
// });

gulp.task('clean', function() {
    return gulp.src(['dist'], {read:false})
        .pipe(clean());
});

gulp.task('default', ['clean'], function() {
    gulp.start('scripts');
})