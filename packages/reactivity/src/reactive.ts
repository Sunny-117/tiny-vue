import { isObject } from "@tiny-vue/shared";
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandler";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = '__v_raw',
}

export const reactiveMap = new WeakMap()
export const shallowReactiveMap = new WeakMap()
export const readonlyMap = new WeakMap()
export const shallowReadonlyMap = new WeakMap()

export function reactive<T extends object>(raw: T) {
  return createReactiveObject(raw, mutableHandlers, reactiveMap);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers, readonlyMap);
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers, shallowReactiveMap);
}

export function isReactive(value) {
  return !!(value && value[ReactiveFlags.IS_REACTIVE]);
}

export function isReadonly(value) {
  return !!(value && value[ReactiveFlags.IS_READONLY]);
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

function createReactiveObject(target, baseHandles, proxyMap) {
  if (!isObject(target)) {
    console.warn(`target ${target} 必须是一个对象`);
    return target
  }
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  const proxy = new Proxy(target, baseHandles);
  proxyMap.set(target, proxy)
  return proxy;
}
