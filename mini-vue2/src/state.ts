import { observe } from "./observer/index";
import { proxy, nextTick } from './util.js'
import Watcher from './observer/watcher.js'
import Dep from "./observer/dep.js";
export function initState(vm) { // vm.$options
    const opts = vm.$options;
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethods(vm);
    }
    if (opts.data) {
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
    if (opts.watch) {
        initWatch(vm);
    }
}
function initProps(vm?) { }
function initMethods(vm?) { }

function initData(vm) { // 数据的初始化操作
    let data = vm.$options.data;
    // vm._data 保存用户的所有的data
    vm._data = data = typeof data == 'function' ? data.call(vm) : data;
    for (let key in data) {
        proxy(vm, '_data', key);
    }
    observe(data); // 让这个对象重新定义set 和 get
}
function initComputed(vm) {
    let computed = vm.$options.computed;
    // 1.需要有watcher  2.还需要通过defineProperty 3.dirty
    const watchers = vm._computedWatchers = {}; // 用来稍后存放计算属性的watcher
    for (let key in computed) {
        const userDef = computed[key]; // 取出对应的值来
        // 获取get方法
        const getter = typeof userDef == 'function' ? userDef : userDef.get; // watcher使用的
        watchers[key] = new Watcher(vm, getter, () => { }, { lazy: true }); // watcher很懒？

        defineComputed(vm, key, userDef)// defineReactive();
    }
}
function defineComputed(target, key, userDef) {  // 这样写是没有缓存的
    const sharedPropertyDefinition = {
        enumerable: true,
        configurable: true,
        get: () => { },
        set: () => { }
    }
    if (typeof userDef == 'function') {
        sharedPropertyDefinition.get = createComputedGetter(key) // dirty 来控制是否调用userDef
    } else {
        sharedPropertyDefinition.get = createComputedGetter(key); // 需要加缓存
        sharedPropertyDefinition.set = userDef.set;
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}
function createComputedGetter(key) {
    return function () { // 此方法是我们包装的方法，每次取值会调用此方法
        const watcher = this._computedWatchers[key]; // 拿到这个属性对应watcher
        if (watcher) {
            if (watcher.dirty) { // 默认肯定是脏的
                watcher.evaluate(); // 对当前watcher求值
            }
            debugger;
            if (Dep.target) { // 说明还有渲染watcher，也应该一并的收集起来
                watcher.depend();
            }
            return watcher.value; // 默认返回watcher上存的值
        }
    }

}

function initWatch(vm) {
    let watch = vm.$options.watch;
    for (let key in watch) {
        const handler = watch[key]; // handler可能是 
        if (Array.isArray(handler)) { // 数组 、
            handler.forEach(handle => {
                createWatcher(vm, key, handle);
            });
        } else {
            createWatcher(vm, key, handler); // 字符串 、 对象 、 函数
        }
    }
}
function createWatcher(vm, exprOrFn, handler, options?) { // options 可以用来标识 是用户watcher
    if (typeof handler == 'object') {
        options = handler
        handler = handler.handler; // 是一个函数
    }
    if (typeof handler == 'string') {
        handler = vm[handler]; // 将实例的方法作为handler
    }
    // key handler 用户传入的选项
    return vm.$watch(exprOrFn, handler, options)
}

export function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (cb) {
        nextTick(cb);
    }
    Vue.prototype.$watch = function (exprOrFn, cb, options: any = {}) {
        // 数据应该依赖这个watcher  数据变化后应该让watcher从新执行
        let watcher = new Watcher(this, exprOrFn, cb, { ...options, user: true });
        if (options.immediate) {
            cb(); // 如果是immdiate应该立刻执行
        }
    }
}