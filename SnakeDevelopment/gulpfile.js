var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngmin = require('gulp-ngmin');
var karma = require('gulp-karma');
var jshint = require('gulp-jshint');

var paths = {
    scripts: ['js/**/*.js', 'js/main.js', 'js/hammer.min.js'],
    scripts2: ['build/js/all.min.js'],
    testunit: ['js/**/*.js',
        '!js/hammer.min.js',
        '!js/main.js',
        'spec/*.js']
};


gulp.task('scripts', function () {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(paths.scripts)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(ngmin({dynamic: false}))
        .pipe(uglify())
        .pipe(concat('snake.js'))
        .pipe(gulp.dest('../Snaked/js'));
});

gulp.task('scriptslocal', function () {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(paths.scripts)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(ngmin({dynamic: false}))
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('test', function () {
    return gulp.src(paths.testunit)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }));
});


// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch(paths.testunit, ['test']);
    gulp.watch(paths.scripts, ['scripts']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'test', 'watch']);