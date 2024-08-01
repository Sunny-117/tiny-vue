import { effect } from "./effect/effect.js";
import track from "./effect/track.js";
import trigger from "./effect/trigger.js";
import { TriggerOpTypes, TrackOpTypes } from "./utils.js";

/**
 * 进行参数归一化
 * @param {*} getterOrOptions
 */
function normalizeParam(getterOrOptions) {
  let getter, setter;
  if (typeof getterOrOptions === "function") {
    // 说明传递的是一个 getter 函数
    getter = getterOrOptions;
    setter = () => {
      console.warn("it has no setter function");
    };
  } else {
    // 说明传递的是一个包含 getter 和 setter 的对象
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return { getter, setter };
}

/**
 *
 * @param {*} getterOrOptions 可能是一个 getter 函数，也可能是一个包含 getter 和 setter 的对象
 */
export function computed(getterOrOptions) {
  // 1. 参数归一化
  const { getter, setter } = normalizeParam(getterOrOptions);

  let value; // 存储计算属性的值
  let dirty = true; // 表示计算属性是否脏，如果为 true，说明需要重新计算

  const effectFn = effect(getter, {
    lazy: true,
    shcheduler() {
      dirty = true;
      trigger(obj, TriggerOpTypes.SET, "value");
    },
  });

  // 2. 返回一个对象
  const obj = {
    get value() {
      track(obj, TrackOpTypes.GET, "value");
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      return value;
    },
    set value(newValue) {
      setter(newValue);
    },
  };

  return obj;
}
