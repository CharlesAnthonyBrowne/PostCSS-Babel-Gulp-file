var
  gulp           = require('gulp');
  postcss        = require('gulp-postcss');
  vars           = require('postcss-simple-vars');
  uglify         = require('gulp-uglify');
  minifyCss      = require('gulp-minify-css');
  postcss        = require('gulp-postcss');
  concat         = require('gulp-concat');
  fs             = require('fs');
  postcssImport  = require('postcss-import');
  zip            = require("gulp-zip");
  streamqueue    = require('streamqueue');
  pjson          = require("./package.json");
  clean          = require("gulp-clean"),
  runSequence    = require("run-sequence");
  url            = require("postcss-url");
  sourcemaps     = require('gulp-sourcemaps');
  autoprefixer   = require('autoprefixer');
  stylelint      = require("stylelint");
  reporter       = require("postcss-reporter")
  atImport       = require("postcss-import");
  babel          = require("gulp-babel");
  processors     = [
                   require('postcss-mixins'),
                   require('postcss-simple-vars'),
                   require('postcss-nested'),
                   require('postcss-import'),
                   require('autoprefixer')({ browsers: ['last 2 versions', '> 2%'] })
  ];

gulp.task("babel", function () {
  return gulp.src("./public/*/**.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat("main.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./public/bundle/"));
});

// Watch task
gulp.task('watch', function(){
  gulp.watch('./public/*/**.css', ['css']);
  gulp.watch('./public/*/**.js', ['babel']);
});

// Compile task
gulp.task('css', function () {
  return gulp.src('./public/*/**.css')
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    // .pipe(postcss([
    //   stylelint({}),
    //   reporter({}),
    // ]))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(concat("main.css"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/bundle/'));
});

/**
 * Generate a zip package of the application
 */
gulp.task("zip", function () {
    var date = new Date().toISOString().replace(/[^0-9]/g, ''),
        stream = streamqueue({ objectMode: true });

    stream.queue(
        gulp.src(
            [
                "public/images/**/*",
                "routes/**/*",
                "views/**/*",
                "!views/layout.jade", // will use the built one
                "app.js",
                "package.json"
            ],
            {base: "."})
    );

    stream.queue(
        gulp.src("build/**/*", {base: "build/"})
    );

    // once preprocess ended, concat result into a real file
    return stream.done()
        .pipe(zip("package-" + pjson.version + "-" + date + ".zip"))
        .pipe(gulp.dest("dist/"));
});

/**
 * Remove build path
 */
gulp.task("clean", function () {
    return gulp.src("build", {read: false}).pipe(clean());
});

gulp.task("production", function (callback) {
    runSequence("css", "babel", "zip", callback);
});
gulp.task('development', ["css", "watch", "babel", "clean"]);
