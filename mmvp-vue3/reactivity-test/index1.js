

// 依赖
let currentEfffect;
class Dep {
    // 1. 收集依赖
    constructor(val) {
        this.effects = new Set()// 依赖不能重复收集
        this._val = val
    }
    get value() {
        return this._val
    }
    set value(newValue) {
        this._val = newValue
    }
    depend() {
        if (currentEfffect) {
            this.effects.add(currentEfffect)
        }
    }
    // 2. 触发依赖
    notice() {
        // 触发一下之前收集到的依赖
        this.effects.forEach(effect => {
            effect()
        })
    }
}
const dep = new Dep(10)
let b;
function effectWactch(effect) {
    currentEfffect = effect
    effect()
    dep.depend()
    currentEfffect = null;
}
effectWactch(() => {
    // console.log('heihei')
    b = dep.value + 10// 更新规则
    console.log(b)
})
// 值变更
dep.value = 20;
dep.notice()// 优化方向：不调用notce