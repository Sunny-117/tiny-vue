import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
    input: './src/index.js',
    output: [{
        file: 'dist/mini-vue2.esm.js',
        format: 'esm'
    },
    {
        file: 'dist/mini-vue2.cjs.js',
        format: 'cjs'
    }],
    plugins: [
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
        }),
        terser({
            format: {
                comments: false, // 去除注释
            },
        }),
    ],
};
