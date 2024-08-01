import { TrackOpTypes, ITERATE_KEY } from "../utils.js";
import { activeEffect, targetMap } from "./effect.js";

let shouldTrack = true; // 控制是否需要进行依赖收集的开关

/**
 * 暂停依赖收集
 */
export function pauseTracking() {
  shouldTrack = false;
}

/**
 * 恢复依赖收集
 */
export function resumeTracking() {
  shouldTrack = true;
}

/**
 * 收集器：用于收集依赖
 * @param {*} target 原始对象
 * @param {*} type 进行的操作类型
 * @param {*} key 针对哪一个属性
 */
export default function (target, type, key) {
  // 先进行开关状态的判断
  if (!shouldTrack || !activeEffect) {
    return;
  }

  // 这里要做的事情其实很简单，就是一层一层的去找，找到了就存储
  let propMap = targetMap.get(target);
  if (!propMap) {
    propMap = new Map();
    targetMap.set(target, propMap);
  }

  // 之前如果是遍历所有的属性， key 会是 undefined
  // 所以对 key 值做一下参数归一化
  if (type === TrackOpTypes.ITERATE) {
    key = ITERATE_KEY;
  }

  let typeMap = propMap.get(key);
  if (!typeMap) {
    typeMap = new Map();
    propMap.set(key, typeMap);
  }

  // 最后一步，根据 type 值去找对应的 Set
  let depSet = typeMap.get(type);
  if (!depSet) {
    depSet = new Set();
    typeMap.set(type, depSet);
  }

  // 现在找到 set 集合了，就可以存储依赖了
  if (!depSet.has(activeEffect)) {
    depSet.add(activeEffect);
    activeEffect.deps.push(depSet); // 将集合存储到 deps 数组里面
  }
}
