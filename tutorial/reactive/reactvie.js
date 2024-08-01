// 这是入口文件，会提供一个 reactive API，该方法接收一个对象，返回一个 Proxy 对象
import handlers from "./handlers/index.js";
import {isObject} from './utils.js';

// 映射表：用于存储原始对象和代理对象之间的映射关系
const proxyMap = new WeakMap();

/**
 * 将对象转换为 Proxy 对象
 * @param {*} target 原始对象
 * @returns
 */
export function reactive(target) {
  // 在转换之前，需要做一些判断，如果 target 不是对象，直接返回
  if (!isObject(target)) {
    return target;
  }

  // 还有一种，就是对象已经代理过了，直接返回之前的代理对象
  if (proxyMap.has(target)) {
    // 进入此 if，说明对象已经代理过了
    return proxyMap.get(target);
  }

  const proxy = new Proxy(target, handlers);

  // 将原始对象和代理对象存储到映射表中
  proxyMap.set(target, proxy);

  return proxy;
}
