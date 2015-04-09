'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gutil = require('gulp-util');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('src/stylesheets/main.scss')
        .pipe($.sass({errLogToConsole: true}))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('src/stylesheets'))
        .pipe(reload({stream:true}))
        .pipe($.size())
        .pipe($.notify("Compilation complete."));;
});

gulp.task('scripts', function () {
    return gulp.src('src/javascripts/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('/*.js');
    var cssFilter = $.filter('/*.css');

    return gulp.src('/*.html')
        .pipe($.useref.assets())
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src('/src/images/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('/static/images'))
        .pipe(reload({stream:true, once:true}))
        .pipe($.size());
});

gulp.task('clean', function () {
    return gulp.src(['app/styles/main.css', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'images', 'fonts']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('serve', ['styles'], function () {
    browserSync.init(null, {
        server: {
            baseDir: 'src',
            directory: true
        },
        debugInfo: false,
        open: false,
        hostnameSuffix: ".xip.io"
    }, function (err, bs) {
        require('opn')(bs.options.url);
        console.log('Started connect web server on ' + bs.options.url);
    });
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;
    gulp.src('app/styles/*.scss')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app/styles'));
    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower_components',
            exclude: ['bootstrap-sass-official']
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('watch', ['serve'], function () {
 
    // watch for changes
    gulp.watch(['src/*.html'], reload);
 
    gulp.watch('src/stylesheets/*.scss', ['styles']);
    gulp.watch('src/javascripts/*.js', ['scripts']);
    gulp.watch('src/images/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
});
