// 这是触发器
import { TriggerOpTypes, TrackOpTypes, ITERATE_KEY } from "../utils.js";
import { targetMap, activeEffect } from "./effect.js";

// 定义修改数据和触发数据的映射关系
const triggerTypeMap = {
  [TriggerOpTypes.SET]: [TrackOpTypes.GET],
  [TriggerOpTypes.ADD]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
  [TriggerOpTypes.DELETE]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
};

/**
 * 触发器
 * @param {*} target 原始对象
 * @param {*} type 操作的类型
 * @param {*} key 操作的属性
 */
export default function (target, type, key) {
  // 要做的事情很简单，就是找到依赖，然后执行依赖
  const effectFns = getEffectFns(target, type, key);
  if (!effectFns) return;
  for (const effectFn of effectFns) {
    if (effectFn === activeEffect) continue;
    if (effectFn.options && effectFn.options.shcheduler) {
      // 说明用户传递了回调函数，用户期望自己来处理依赖的函数
      effectFn.options.shcheduler(effectFn);
    } else {
      // 执行依赖函数
      effectFn();
    }
  }
}

/**
 * 根据 target、type、key 这些信息找到对应的依赖函数集合
 * @param {*} target
 * @param {*} type
 * @param {*} key
 */
function getEffectFns(target, type, key) {
  const propMap = targetMap.get(target);
  if (!propMap) return;

  // 如果是新增或者删除操作，会涉及到额外触发迭代
  const keys = [key];
  if (type === TriggerOpTypes.ADD || type === TriggerOpTypes.DELETE) {
    keys.push(ITERATE_KEY);
  }

  const effectFns = new Set(); // 用于存储依赖的函数

  for (const key of keys) {
    const typeMap = propMap.get(key);
    if (!typeMap) continue;

    const trackTypes = triggerTypeMap[type];
    for (const trackType of trackTypes) {
      const dep = typeMap.get(trackType);
      if (!dep) continue;
      for (const effectFn of dep) {
        effectFns.add(effectFn);
      }
    }
  }
  return effectFns;
}
