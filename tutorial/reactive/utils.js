// 提供工具方法的文件

/**
 * 判断是否是对象
 * @param {*} target 要判断的值
 * @returns
 */
export function isObject(target) {
  return typeof target === "object" && target !== null;
}

/**
 * 判断值是否改变
 * @param {*} oldValue
 * @param {*} newValue
 * @returns
 */
export function hasChanged(oldValue, newValue) {
  // 使用该方法可以规避一些特殊的情况
  // NaN === NaN 在 JS 中是 false，Object.is 返回的是 true
  // +0 === -0 在 JS 中是 true，Object.is 返回的是 false
  return !Object.is(oldValue, newValue);
}

/**
 * 收集依赖的操作类型
 */
export const TrackOpTypes = {
  GET: "get",
  HAS: "has",
  ITERATE: "iterate",
};

/**
 * 触发器的操作类型
 */
export const TriggerOpTypes = {
  SET: "set",
  ADD: "add",
  DELETE: "delete",
};

/**
 * 这是一个特殊标识
 */
export const RAW = Symbol("raw");

export const ITERATE_KEY = Symbol("iterate");