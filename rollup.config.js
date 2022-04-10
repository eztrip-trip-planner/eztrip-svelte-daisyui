import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import pkg from './package.json';
import externals from 'rollup-plugin-node-externals';
import { sveld } from 'sveld';
// import

const production = !process.env.ROLLUP_WATCH;

export default [
    {
        input: 'src/components/index.js',
        output: [
            {
                sourcemap: true,
                file: pkg.module,
                format: 'es',
            },
            {
                sourcemap: true,
                file: pkg.main,
                format: 'umd',
                name: pkg.name,
            },
        ],
        plugins: [
            svelte({
                preprocess: sveltePreprocess({
                    scss: { renderSync: true },
                    postcss: { plugins: [tailwindcss(), autoprefixer()] },
                }),
                emitCss: false,
            }),
            resolve({ browser: true, dedupe: ['svelte'] }),
            commonjs(),
            sveld(),
            production && terser(),
        ],
    },
    {
        input: 'src/plugin/index.ts',
        output: {
            sourcemap: true,
            file: 'dist/plugin.js',
            format: 'cjs',
            exports: 'auto',
        },
        plugins: [externals(), resolve(), commonjs(), typescript(), production && terser()],
    },
];
