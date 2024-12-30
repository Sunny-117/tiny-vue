import { readdirSync, statSync } from "fs"
import execa from "execa"

const targets = readdirSync("packages").filter((f) => {
  if (!statSync(`packages/${f}`).isDirectory()) {
    return false
  }
  return true
})
async function runParallel(source, iteratorFn) {
  const ret = []
  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item))
    ret.push(p)
  }
  return Promise.all(ret)
}
async function build(target) {
  await execa("rollup", ["-c", "--environment", `TARGET:${target}`], {
    stdio: "inherit",
  })
}
runParallel(targets, build)
