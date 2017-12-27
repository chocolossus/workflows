var gulp = require("gulp"),
    gutil = require("gulp-util"),
    coffee = require("gulp-coffee"),
    browserify = require("gulp-browserify"),
    compass = require("gulp-compass"),
    minifyCSS = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    concat = require("gulp-concat"),
    runSequence = require('run-sequence');

var coffeeSources = ["components/coffee/tagline.coffee"];
var jsSources = ["components/scripts/rclick.js",
                 "components/scripts/pixgrid.js",
                 "components/scripts/tagline.js",
                 "components/scripts/template.js"];

var sassSources = ["components/sass/style.scss"];

gulp.task("coffee", function(){
  gulp.src(coffeeSources)
      .pipe(coffee({bare: true}))
      .on("error", gutil.log)
      .pipe(gulp.dest("components/scripts"))
});

gulp.task("js", function(){
  gulp.src(jsSources)
      .pipe(concat("script.js"))
      .pipe(browserify())
      .pipe(gulp.dest("builds/development/js"));
});

gulp.task('clean', ["compass"], function () {
  return gulp.src('temp', {read: false})
    .pipe(clean());
});

gulp.task("compass", function(done){
  gulp.src(sassSources)
      .pipe(compass({
        css: "temp",
        sass: "components/sass",
        image: "builds/development/images",
        style: "expanded",
        comments: "true",
      }))
      .on("error", gutil.log)
      //.pipe(minifyCSS())
      .pipe(gulp.dest("builds/development/css"))
      .on("end", function() { done(); });
      //the secret sauce here is shoving the done into the end event
      //this forces the system to wait for this to finish
      //then you make the clean dependent on this finishing
      //then you make dev dependent on clean finishing
});

gulp.task("dev", ["clean"]);

/*
gulp.task('dev', function(done) {
    runSequence('compass', 'clean', function() {
        console.log('Run something else');
        done();
    });
});
*/
