import minimist from "minimist";
import { createRequire } from "module";
import { dirname, resolve } from "path"
import { fileURLToPath } from "url";
import esbuild from "esbuild"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// 提供module 目的让打包后的产物可以通过require引用
const require = createRequire(import.meta.url)

const args = minimist(process.argv.slice(2))
console.log(args)
const target = args._[0] || "reactivity"
const format = args.f || "iife"

// 入口文件  根据命令行提供的路径解析
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)
// json文件可以直接通过require拿到
const pkg = require(`../packages/${target}/package.json`)

esbuild
    .context({
        entryPoints: [entry], // 入口
        outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`), // 出口
        bundle: true, // reactivity shared打包到一起
        platform: "browser",
        sourcemap: true,
        format,
        globalName: pkg.buildOptions?.name
    })
    .then(ctx => {
        return ctx.watch()
    })
