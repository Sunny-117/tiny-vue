import { activeEffect, trackEffect, triggerEffect } from './effect'

const targetMap = new WeakMap()

export function createDep(cleanup, key) {
    const dep: any = new Map() // 创建的收集器还是一个map 
    dep.cleanup = cleanup  // 增加清理方法
    dep.key = key // 自定义标识
    return dep
}


export function track(target, key) {
    // activeEffect 如果存在，说明这个key是在effect中访问
    // 没有则说明在effect之外访问不用收集
    if (activeEffect) {
        let desMap = targetMap.get(target)
        if (!desMap) {
            targetMap.set(target, (desMap = new Map()))
        }


        let dep = desMap.get(key)
        if (!dep) {
            desMap.set(key, dep = createDep(() => { desMap.delete(key) }, key))
        }

        // 把当前effect放到dep中，后续可以根据值的变化触发dep中存放的effect
        trackEffect(activeEffect, dep);
    }
}

export function trigger(target, key, value, oldValue) {
    const depsMap = targetMap.get(target)

    if (!depsMap) {
        return
    }

    let dep = depsMap.get(key)
    if (dep) {
        // 修改的属性对应了effect
        triggerEffect(dep)
    }
}


// weakMap结构 收集依赖  key是对象 value是map结构
// {
//     { name: 'ben', "age": 30 } : {
//         age: {
//            { effect:count } // count是effect执行的次数
//         },
//         name: {
//             { effect:count },{ effect:count }
//         }
//     }
// }

