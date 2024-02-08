

// 依赖
let currentEfffect;
class Dep {
    // 1. 收集依赖
    constructor(val) {
        this.effects = new Set()// 依赖不能重复收集
        this._val = val
    }
    get value() {
        this.depend()
        return this._val
    }
    set value(newValue) {
        this._val = newValue
        this.notice()
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
    // console.log(b)
})
// 值变更
dep.value = 20;
// dep.notice()


// 现在就非常像ref了
// 目标：实现reactive
// 刚才的dep只是代表了number/string
// reactive->object/array->key->dep

// 1. 这个对象在什么时候改变了
// obj.a ->get
// obj.a =2->set
// vue2: Object.defineProperty
// vue3:proxy

const targetMap = new Map()
function getDep(target, key) {
    // key必须对应dep dep我们存储在那里
    /**
     * key<=>dep
     */
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Dep()
        depsMap.set(key, dep)
    }
    // 依赖收集
    dep.depend()
    return dep
}
function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            // console.log(key)
            const dep = getDep(target, key)
            // 依赖收集
            dep.depend()
            return Reflect.get(target, key)// 相当于 return target[key]
        },
        set(target, key, value) {
            // 触发依赖
            const dep = getDep(target, key)
            const result = Reflect.set(target, key, value)
            dep.notice()
            return result
        }
    })
}
const user = reactive({
    age: 19
})
let double
effectWactch(() => {
    console.log('---reactive----')
    double = user.age
    // console.log(user.age)// 触发get->getDep->dep.depend()
    console.log(double)
})
user.age = 20