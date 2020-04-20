import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import resolve from '@rollup/plugin-node-resolve';
import { sass } from 'svelte-preprocess-sass';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';

const pkgName = require('./package.json').name;

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/index.js',
    output: [
        {
            format: 'esm',
            sourcemap: true,
            file: `build/${pkgName}.esm.js`
        },
        {
            format: 'cjs',
            sourcemap: true,
            file: `build/${pkgName}.common.js`
        },
        {
            format: 'umd',
            sourcemap: true,
            name: 'SvelteRenderPlugin',
            file: `build/${pkgName}.min.js`
        }
    ],
    plugins: [
        svelte({
            dev: !production,
            preprocess: {
                style: sass()
            }
        }),

        resolve({
            browser: true,
            dedupe: ['svelte']
        }),

        commonjs(),

        buble({
            objectAssign: 'Object.assign',
            transforms: { asyncAwait: false }
        }),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('public'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser()
    ]
};

function serve() {
    let started = false;

    return {
        writeBundle() {
            if (!started) {
                started = true;

                require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true
                });
            }
        }
    };
}
