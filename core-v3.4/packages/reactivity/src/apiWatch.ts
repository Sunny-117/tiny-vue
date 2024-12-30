import { isFunction, isObject } from "@vue/shared"
import { ReactiveEffect } from "./effect"
import { isReactive } from "./reactive"
import { isRef } from "./ref"

export function watch(source, cb, option = {} as any) {
    return doWatch(source, cb, option)
}

// seen 是防止循环引用对象
// depth控制遍历层级
// ! 遍历会触发每个属性的get
function traverse(source, depth, currentDepth = 0, seen = new Set()) {
    if (!isObject(source)) {
        return source
    }

    if (depth) {
        if (currentDepth >= depth) {
            return source
        }
        currentDepth++
    }

    if (seen.has(source)) {
        return source
    }

    // 在此将当前对象添加到 `seen`
    seen.add(source);

    for (let key in source) {
        traverse(source[key], depth, currentDepth, seen)
    }

    return source  // ! 遍历会触发每个属性的get
}

export function watchEffect(source, options = {}) {
    // 没有cb就是watchEffect
    return doWatch(source, null, options as any)
}


function doWatch(source, cb, { deep, immediate = false }) {

    const reactiveGetter = (source) => traverse(source, deep === false ? 1 : undefined)

    let getter

    // 先判断是否是响应式对象
    if (isReactive(source)) {
        getter = () => reactiveGetter(source)
    } else if (isRef(source)) {
        getter = () => source.value
    } else if (isFunction(source)) {
        getter = source
    }

    // 产生一个可以给ReactiveEffect 来使用的getter  需要对这个对象进行取值操作 会关联当前的reactiveEffect
    let oldValue;
    let clean
    const onCleanup = (fn) => {
        clean = () => {
            fn()
            clean = undefined
        }
    }
    const job = () => {
        if (cb) {
            const newValue = effect.run()
            if (clean) {
                clean() // 在执行回调前 先调用上一次清理操作进行清理
            }
            cb(oldValue, newValue, onCleanup)
            oldValue = newValue
        } else {
            effect.run()
        }
    }
    // traverse 的getter作用：不管source的哪个属性变化了，都会触发job的重新运行
    const effect = new ReactiveEffect(getter, job)

    if (cb) {
        if (immediate) { // 立即先执行一次用户的回调，传递新值老值
            job()
        } else {
            oldValue = effect.run()
        }
    } else {

        //watchEffect 直接执行 
        effect.run()
    }

    const unwatch = () => {
        effect.stop()
    }

    return unwatch
}