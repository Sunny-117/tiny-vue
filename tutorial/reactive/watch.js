import { effect, cleanup } from "./effect/effect.js";

/**
 *
 * @param {*} source 响应式数据或者 getter 函数（数组的情况暂不考虑）
 * @param {*} cb 要执行的回调函数
 * @param {*} options 选项对象
 */
export function watch(source, cb, options = {}) {
  // 1. 参数归一化，再次重申，这里没有考虑数组的情况
  let getter;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  let oldValue, newValue; // 用于存储 getter 上一次的值和当前值

  const job = () => {
    newValue = effectFn();
    cb(newValue, oldValue);
    oldValue = newValue;
  };

  const effectFn = effect(() => getter(), {
    lazy: true,
    shcheduler: () => {
      if (options.flush === "post") {
        Promise.resolve().then(job);
      } else {
        job();
      }
    },
  });

  if (options.immediate) {
    job();
  } else {
    effectFn();
  }

  return () => {
    cleanup(effectFn);
  };
}

/**
 * 该工具方法用于遍历对象的所有属性，包括嵌套对象的属性
 * 之所以要遍历，是为了触发这些属性的依赖收集
 * @param {*} value
 * @param {*} seen
 */
function traverse(value, seen = new Set()) {
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return value;
  }

  seen.add(value);

  for (const key in value) {
    traverse(value[key], seen);
  }

  return value;
}
