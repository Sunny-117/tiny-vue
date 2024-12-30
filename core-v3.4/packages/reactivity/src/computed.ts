import { isFunction } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { trackRefValue, triggerRefValue } from "./ref";


class computedRefImp {
    public _value // 老值
    public effect
    public dep
    constructor(getter, public setter) {
        this.effect = new ReactiveEffect(
            () => getter(this._value),
            () => {
                // 计算属性依赖的值变化时，重新触发effect的渲染
                triggerRefValue(this)
            })
    }

    get value() { // 让计算属性收集对应的effect
        if (this.effect.dirty) { // 默认取值一定是脏的，但是执行一次run后就不脏了
            this._value = this.effect.run()
            // 如果在当前effect中访问了计算属性，计算属性需要收集这个effect
            trackRefValue(this)
        }
        return this._value
    }

    set value(v) {
        this.setter(v)
    }
}

export function computed(getterOrOptions) {
    let onlyGetter = isFunction(getterOrOptions)

    let getter, setter
    if (onlyGetter) {
        getter = getterOrOptions
        setter = () => { }
    } else {
        getter = getterOrOptions.get
        setter = getterOrOptions.set
    }

    return new computedRefImp(getter, setter)

}