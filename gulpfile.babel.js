import { readdirSync } from "fs";

import {
    dest,
    parallel,
    series,
    src
} from "gulp";

import { rollup } from "rollup";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

import sourcemaps from "gulp-sourcemaps";
import lessFn from "gulp-less";
import csso from "gulp-csso";

import eslint from "gulp-eslint";

import { camelize } from "./src/utils";

export function js() {
    return buildJsEntry("./src/core.js", "share-this", "ShareThis", "dist/");
}

export function sharers() {
    return Promise.all(
        readdirSync("./src/sharers").map((file) => {
            const name = file.replace(/\.js$/i, "");
            return buildJsEntry(`./src/sharers/${file}`, name, `ShareThisVia${camelize(name)}`, "dist/sharers/");
        })
    );
}

export function less() {
    return src("./style/less/share-this.less")
        .pipe(sourcemaps.init())
        .pipe(lessFn())
        .pipe(csso())
        .pipe(sourcemaps.write("."))
        .pipe(dest("dist/"));
}

export function lint() {
    return src([ "./src/**/*.js", "./test/**/**.js", "./gulpfile.babel.js" ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

export default series(lint, parallel(js, sharers, less));

function buildJsEntry(file, name, standalone, output) {
    return rollup({
        input: file,
        plugins: [
            babel({
                babelrc: false,
                presets: [
                    [ "@babel/env", {
                        modules: false,
                        exclude: [ "@babel/plugin-transform-typeof-symbol" ]
                    }]
                ],
                plugins: [
                    [ "@babel/plugin-transform-template-literals", { loose: true }],
                    [ "@babel/plugin-transform-spread", { loose: true }]
                ]
            }),
            terser()
        ]
    }).then(bundle => bundle.write({
        file: `${output}${name}.js`,
        format: "umd",
        name: standalone,
        sourcemap: true
    }));
}
