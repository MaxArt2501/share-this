import { readdirSync } from "fs";

import { dest, parallel, series, src } from "gulp";

import uglify from "gulp-uglify";
import rollup from "rollup-stream";
import babel from "rollup-plugin-babel";

import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";

import lessFn from "gulp-less";
import csso from "gulp-csso";

import eslint from "gulp-eslint";

import { camelize } from "./src/utils";

export function js() {
    buildJsEntry("./src/core.js", "share-this", "ShareThis", "dist/");
}

export function sharers() {
    readdirSync("./src/sharers").forEach((file) => {
        const name = file.replace(/\.js$/i, "");
        if (name === file) return;
        buildJsEntry(`./src/sharers/${file}`, name, `ShareThisVia${camelize(name)}`, "dist/sharers/");
    });
}

export function less() {
    return src("./style/less/share-this.less")
        .pipe(lessFn())
        .pipe(csso())
        .pipe(dest("dist/"))
    ;
}

export function lint() {
    const result = src([ "./src/**/*.js", "./test/**/**.js", "./gulpfile.babel.js" ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());

    return result;
}

export default series(lint, parallel(js, sharers, less));

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
        .pipe(dest(output))
    ;
}
