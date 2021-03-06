var gulp = require("gulp"),
    gutil = require("gulp-util"),
    coffee = require("gulp-coffee"),
    browserify = require("gulp-browserify"),
    compass = require("gulp-compass"),
    minifyCSS = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    concat = require("gulp-concat");

var coffeeSources,
  jsSources,
  sassSources,
  sassFinal,
  htmlSources,
  jsonSources,
  outputDir;

env = process.env.NODE_ENV || "development";

if(env==="development"){
  outputDir = "builds/development";
  sassStyle = "expanded";
}else{
  outputDir = "builds/production";
  sassStyle = "compressed";
}

coffeeSources = ["components/coffee/tagline.coffee"];
jsSources = ["components/scripts/rclick.js",
                 "components/scripts/pixgrid.js",
                 "components/scripts/tagline.js",
                 "components/scripts/template.js"];

sassSources = ["components/sass/*.scss"];
sassFinal = ["components/sass/style.scss"];
htmlSources = ["builds/development/*.html"];
jsonSources = ["builds/development/js/*.json"];

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
      .pipe(gulp.dest(outputDir+"/js"))
      .pipe(connect.reload());
});

gulp.task('clean', ["compass"], function () {
  return gulp.src('temp', {read: false})
    .pipe(clean());
});

gulp.task("compass", function(done){
  gulp.src(sassFinal)
      .pipe(compass({
        css: "temp",
        sass: "components/sass",
        image: outputDir+"/images",
        style: sassStyle,
        comments: "true",
      }))
      .on("error", gutil.log)
      //.pipe(minifyCSS())
      .pipe(gulp.dest(outputDir+"/css"))
      .pipe(connect.reload())
      .on("end", function() { done(); });
      //the secret sauce here is shoving the done into the end event
      //this forces the system to wait for this to finish
      //then you make the clean dependent on this finishing
      //then you make dev dependent on clean finishing
});

gulp.task("html", function(){
  gulp.src(htmlSources)
      .pipe(connect.reload());
});

gulp.task("json", function(){
  gulp.src(jsonSources)
      .pipe(connect.reload());
});

gulp.task("dev", ["coffee", "js", "html", "json", "clean"]);

gulp.task("watch", ["dev"], function(){
  gulp.watch(coffeeSources, ["coffee"]);
  gulp.watch(jsSources, ["js"]);
  gulp.watch(sassSources, ["clean"]);
  gulp.watch(htmlSources, ["html"]);
  gulp.watch(jsonSources, ["json"]);
});

console.log("test message of some sort");

gulp.task("connect", function(){
  connect.server({
    root: outputDir,
    livereload:true
  });
});


gulp.task("default", ["connect", "watch"]);
