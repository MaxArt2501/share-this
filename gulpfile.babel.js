import { readdirSync } from "fs";

import gulp from "gulp";

import uglify from "gulp-uglify";
import browserify from "browserify";
import babelify from "babelify";
import rollupify from "rollupify";

import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";

import less from "gulp-less";
import cssnano from "gulp-cssnano";

gulp.task("js", _ => {
    buildJsEntry("./src/core.js", "share-this", "ShareThis", "dist/");
});

gulp.task("sharers", _ => {
    readdirSync("./src/sharers").forEach(file => {
        const name = file.replace(/\.js$/i, "");
        if (name === file) return;
        buildJsEntry(`./src/sharers/${file}`, name, "ShareThisVia" + name[0].toUpperCase() + name.slice(1), "dist/sharers/");
    });
});

gulp.task("less", _ => {
    gulp.src("./style/less/share-this.less")
        .pipe(less())
        .pipe(cssnano())
        .pipe(gulp.dest("dist/"))
});

gulp.task("default", _ => {
    gulp.start("js");
    gulp.start("sharers");
    gulp.start("less");
});

function buildJsEntry(file, name, standalone, output) {
    browserify({
            entries: [ file ],
            standalone
        })
        .transform(rollupify)
        .transform(babelify)
        .bundle()
        .pipe(source(`${name}.js`))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(output))
    ;
}
