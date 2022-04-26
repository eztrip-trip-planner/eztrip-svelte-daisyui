import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import externals from 'rollup-plugin-node-externals';

export default {
    input: 'src/plugin/index.ts',
    output: {
        sourcemap: true,
        file: './dist/plugin/index.cjs',
        format: 'cjs',
        exports: 'auto',
    },
    plugins: [externals(), nodeResolve(), commonjs(), json(), typescript()],
};
