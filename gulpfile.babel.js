import { readdirSync } from "fs";

import gulp from "gulp";

import uglify from "gulp-uglify";
import rollup from "rollup-stream";
import babel from "rollup-plugin-babel";

import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";

import less from "gulp-less";
import cssnano from "gulp-cssnano";

import eslint from "gulp-eslint";

import { camelize } from "./src/utils";

gulp.task("js", () => {
    buildJsEntry("./src/core.js", "share-this", "ShareThis", "dist/");
});

gulp.task("sharers", () => {
    readdirSync("./src/sharers").forEach((file) => {
        const name = file.replace(/\.js$/i, "");
        if (name === file) return;
        buildJsEntry(`./src/sharers/${file}`, name, `ShareThisVia${camelize(name)}`, "dist/sharers/");
    });
});

gulp.task("less", () => {
    gulp.src("./style/less/share-this.less")
        .pipe(less())
        .pipe(cssnano({ autoprefixer: false }))
        .pipe(gulp.dest("dist/"))
    ;
});

gulp.task("lint", () => {
    const result = gulp
        .src([ "./src/**/*.js", "./test/**/**.js", "./gulpfile.babel.js" ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());

    return result;
});

gulp.task("default", [ "lint" ], () => {
    gulp.start("js");
    gulp.start("sharers");
    gulp.start("less");
});

function buildJsEntry(file, name, standalone, output) {
    rollup({
        input: file,
        format: "umd",
        name: standalone,
        plugins: [ babel({
            babelrc: false,
            presets: [ [ "es2015", { modules: false }] ]
        }) ]
    })
        .pipe(source(`${name}.js`))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(output))
    ;
}
