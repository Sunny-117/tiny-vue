import { arrayMethods } from "./array";
import { defineProperty } from "../util";
import Dep from "./dep";
class Observer {
    dep: Dep;
    constructor(value) {
        this.dep = new Dep(); // value ={}  value = []
        // 使用defineProperty 重新定义属性
        // 判断一个对象是否被观测过看他有没有 __ob__这个属性
        defineProperty(value, '__ob__', this);
        if (Array.isArray(value)) {
            // 我希望调用push shift unshift splice sort reverse pop
            (value as any).__proto__ = arrayMethods;
            this.observeArray(value); // 数组中普通类型是不做观测的
        } else {
            this.walk(value);
        }
    }
    observeArray(value) {
        value.forEach(item => {
            observe(item); // 观测数组中的对象类型
        })
    }
    walk(data) {
        let keys = Object.keys(data); // 获取对象的key
        keys.forEach(key => {
            defineReactive(data, key, data[key]); // Vue.util.defineReactive
        });
    }
}
// 封装 继承
function defineReactive(data, key, value) {
    // 获取到数组对应的dep
    let childDep = observe(value); // 如果值是对象类型在进行观测

    let dep = new Dep(); // 每个属性都有一个dep 
    // 当页面取值时 说明这个值用来渲染了，将这个watcher和这个属性对应起来
    Object.defineProperty(data, key, {
        get() { // 依赖收集
            if (Dep.target) { // 让这个属性记住这个watcher
                dep.depend();
                if (childDep) { // 可能是数组可能是对象
                    // 默认给数组增加了一个dep属性，当对数组这个对象取值的时候
                    childDep.dep.depend(); // 数组存起来了这个渲染watcher
                }
            }
            return value
        },
        set(newValue) { // 依赖更新
            if (newValue === value) return;
            observe(newValue); // 如果用户将值改为对象继续监控
            value = newValue;

            dep.notify(); // 异步更新 防止频繁操作
        }
    });
    // 数组的更新 去重  优化  组件渲染
}

export function observe(data) {
    // typeof null 也是object
    // 不能不是对象 并且不是null
    if (typeof data !== 'object' || data == null) {
        return;
    }
    if (data.__ob__) {
        return data;
    }
    return new Observer(data)

    // 只观测存在的属性 data:{a:1,b:2} 
    // 数组中更改索引和长度 无法被监控
    // vm.a = {a:1}
}