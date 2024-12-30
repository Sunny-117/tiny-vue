import { isObject } from "@vue/shared"
import { track, trigger } from './reactiveEffect'
import { reactive } from './reactive'
import { ReactiveFlags } from './constants'

export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true // 说明已经被代理过了
        }
        track(target, key) // 收集这个对象上的这个属性和effect关联在一起
        let res = Reflect.get(target, key, receiver)
        if (isObject) {
            return reactive(res)
        }
        return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
        const oldValue = target[key]
        let result = Reflect.set(target, key, value, receiver)
        if (oldValue !== value) {
            // 触发页面更新
            trigger(target, key, value, oldValue)

        }
        return result
    }
}