import { isObject } from "@vue/shared";
import { mutableHandlers } from "./baseHandler";
import { ReactiveFlags } from './constants'

// 用于记录代理后的结果 可以复用
const reactiveMap = new WeakMap()

function createReactiveObjective(target) {
    if (!isObject(target)) {
        return target
    }

    // 代理的对象 再代理的话 返回
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target
    }

    // 缓存
    const exitProxy = reactiveMap.get(target)
    if (exitProxy) {
        return exitProxy
    }
    let proxy = new Proxy(target, mutableHandlers)
    reactiveMap.set(target, proxy)
    return proxy
}

export function reactive(target) {
    return createReactiveObjective(target)
}


export function toReactive(value) {
    return isObject(value) ? reactive(value) : value
}


export function isReactive(value) {
    return !!(value && value[ReactiveFlags.IS_REACTIVE])
}