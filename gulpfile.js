const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const minifyHTML = require('gulp-minify-html');
const replace = require('gulp-replace');
const imagemin = require('gulp-imagemin');
const clone = require('gulp-clone');
const clean = require('gulp-clean');
const zip = require('gulp-zip');
const eslint = require('gulp-eslint');

//eslint
gulp.task('eslint', function () {
    return gulp.src("src/**/**.js")
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

//清空dist
gulp.task('clean', function () {
    return gulp.src('dist', {
            read: false
        })
        .pipe(clean());
});

//修改manifest.json
gulp.task('replace-json', function () {
    return gulp.src("src/manifest.json")
        .pipe(replace('["main/data.js","main/i18n.js","main/dom.js","main/utils.js","main/main.js"]', '["main/main.js"]'))
        .pipe(gulp.dest("dist"));
});

//壓縮HTML
gulp.task('compress-html', function () {
    return gulp.src(['src/*.html', 'src/options/*.html', 'src/popup/*.html', 'src/manuel/*.html'], {
            base: "src"
        })
        .pipe(minifyHTML({
            comments: false,
            spare: false,
            quotes: true
        }))
        .pipe(gulp.dest('dist'));
});

//壓縮css
gulp.task('compress-css', () => {
    return gulp.src(['src/*.css', 'src/main/*.css', 'src/options/*.css', 'src/popup/*.css', 'src/manuel/*.css'], {
            base: "src"
        })
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist'));
});

//合併,壓縮main.js
gulp.task('main-js', function () {
    return gulp.src('src/main/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/main'));
});

//壓縮其他js
gulp.task("compress-js", function () {
    return gulp.src(['src/*.js', 'src/options/*.js', 'src/popup/*.js', 'src/manuel/*.js'], {
            base: "src"
        })
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});

//壓縮圖片
gulp.task('compress-image', function () {
    return gulp.src(['src/res/**'], {
            base: "src"
        })
        .pipe(imagemin())
        .pipe(gulp.dest('dist'))
});

//複製剩餘檔案
gulp.task('clone-rest', function () {
    return gulp.src(['src/_locales/**', 'src/lib/**'], {
            base: 'src'
        })
        .pipe(clone())
        .pipe(gulp.dest('dist'))
});

//壓縮發佈用zip檔
gulp.task('zip', function () {
    return gulp.src('dist/**')
        .pipe(zip('ExHentaihuolu.zip'))
        .pipe(gulp.dest('dist'))
});

//全部執行
gulp.task('default', gulp.series("eslint","clean", "compress-html", "compress-css", "main-js", "compress-js", "compress-image", "replace-json", "clone-rest", "zip"));