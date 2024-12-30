import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import tsPlugin from "rollup-plugin-typescript2"
import path from 'path'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 获取packages目录
const packagesDir = path.resolve(__dirname, "packages")
// 获取对应的模块
const packageDir = path.resolve(packagesDir, process.env.TARGET)
// 全部以打包目录来解析文件
const resolve = (p) => path.resolve(packageDir, p)
const pkg = require(resolve("package.json"))
const name = path.basename(packageDir) // 获取包的名字

// 配置打包信息
const outputConfigs = {
  "esm-bundler": {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: "es",
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: "cjs",
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: "iife",
  },
}
// 获取formats
const packageFormats = process.env.FORMATS && process.env.FORMATS.split(",")
const packageConfigs = packageFormats || pkg.buildOptions.formats


function createConfig(format, output) {
  output.sourcemap = process.env.SOURCE_MAP
  output.exports = "named"
  let external = []
  if (format === "global") {
    output.name = pkg.buildOptions.name
  } else {
    // cjs/esm 不需要打包依赖文件
    external = [...Object.keys(pkg.dependencies || {})]
  }
  return {
    input: resolve("src/index.ts"),
    output,
    external,
    plugins: [json(), tsPlugin(), commonjs(), nodeResolve()]
  }
}

export default packageConfigs.map((format) =>
  createConfig(format, outputConfigs[format])
)
