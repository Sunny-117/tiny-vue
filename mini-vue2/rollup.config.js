import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts';


export default {
    input: './src/index.ts',
    output: [{
        name: 'Vue',
        file: 'dist/Vue.esm.js',
        sourcemap: true,
        format: 'esm'
    },
    {
        name: 'Vue',
        file: 'dist/Vue.cjs.js',
        sourcemap: true,
        format: 'cjs'
    },
    {
        name: 'Vue',
        file: 'dist/Vue.umd.js',
        sourcemap: true,
        format: 'umd'
    },
    {
        name: 'Vue',
        file: 'dist/index.d.ts',
        plugins: [dts()],
        output: {
            format: 'esm',
            file: 'dist/index.d.ts',
        },
    },
    ],
    plugins: [
        typescript()
    ]
}