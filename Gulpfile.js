var
	gulp           = require('gulp'),
	postcss        = require('gulp-postcss'),
  vars           = require('postcss-simple-vars')
	postcss        = require('gulp-postcss');
  concat         = require('gulp-concat');
	fs             = require("fs")
	url            = require("postcss-url")
	sourcemaps     = require('gulp-sourcemaps');
	autoprefixer   = require('autoprefixer');
	atImport       = require("postcss-import")
  babel          = require("gulp-babel");
	processors     = [
									 require('postcss-mixins'),
									 require('postcss-simple-vars'),
									 require('postcss-nested'),
									 require('autoprefixer')({ browsers: ['last 2 versions', '> 2%'] })
	];

gulp.task("babel", function () {
  return gulp.src("./*.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./bundle/"));
});

// Watch task
gulp.task('watch', function(){
  gulp.watch('./*.css', ['css']);
	gulp.watch('./*.js', ['babel']);
});

// Compile task
gulp.task('css', function () {
    return gulp.src('./*.css')
        .pipe(sourcemaps.init())
	      .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./bundle/'));
});


gulp.task('default', ["css", "watch", "babel"]);
