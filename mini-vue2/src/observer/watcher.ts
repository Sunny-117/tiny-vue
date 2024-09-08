import { pushTarget, popTarget } from "./dep";
import { nextTick } from "../util";

let id = 0;
class Watcher {
    vm: any;
    exprOrFn: any;
    cb: any;
    options: any;
    user: any;
    lazy: any;
    dirty: any;
    id: number;
    deps: any[];
    depsId: Set<unknown>;
    getter: any;
    value: any; // vm.$watch
    // vm实例
    // exprOrFn  vm._update(vm._render())
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.options = options;
        this.user = options.user; // 这是一个用户watcher
        this.lazy = options.lazy; // 如果watcher上有lazy属性 说明是一个就算属性
        this.dirty = this.lazy; // dirty代表取值时是否执行用户提供的方法
        this.id = id++; // watcher的唯一标识
        this.deps = []; // watcher记录有多少dep依赖他
        this.depsId = new Set();
        if (typeof exprOrFn == 'function') {
            this.getter = exprOrFn
        } else {
            this.getter = function () { // exprOrFn 可能传递过来的是一个字符串a
                // 当去当前实例上取值时 才会触发依赖收集
                let path = exprOrFn.split('.'); // ['a','a','a']
                let obj = vm;
                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]] // vm.a   // vm.a.a
                }
                return obj;
            }
        }
        // 默认会先调用一次get方法 ，进行取值 将结果保留下来
        this.value = this.lazy ? void 0 : this.get(); // 默认会调用get方法 
    }
    addDep(dep) {
        let id = dep.id;
        if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this)
        }
    }
    get() {
        // Dep.target = watcher
        pushTarget(this); // 当前watcher实例
        let result = this.getter.call(this.vm); // 调用exprOrFn  渲染页面 取值（执行了get方法）  render方法 with(vm){_v(msg)}
        popTarget(); //渲染完成后 将watcher删掉了
        return result
    }
    run() {
        let newValue = this.get(); // 渲染逻辑
        let oldValue = this.value;
        this.value = newValue; // 更新一下老值
        if (this.user) {
            this.cb.call(this.vm, newValue, oldValue);
        }
    }
    update() {
        if (this.lazy) { // 是计算属性
            this.dirty = true;// 页面重新渲染就可以获得最新的值了
        } else {
            // 这里不要每次都调用get方法 get方法会重新渲染页面
            queueWatcher(this); // 暂存的概念
            //this.get(); // 重新渲染
        }
    }
    evaluate() {
        this.value = this.get();
        this.dirty = false; // 取过一次值之后 就表示成已经取过值了
    }
    depend() {
        // 计算属性watcher 会存储 dep  dep会存储watcher

        // 通过watcher找到对应的所有dep，让所有的dep 都记住这个渲染watcher
        let i = this.deps.length;
        while (i--) {
            this.deps[i].depend(); // 让dep去存储渲染watcher
        }
    }
}
let queue = []; // 将需要批量更新的watcher 存到一个队列中，稍后让watcher执行
let has = {};
let pending = false;

function flushSchedulerQueue() {
    queue.forEach(watcher => {
        watcher.run();
        if (!watcher.user) {
            watcher.cb()
        }
    });
    queue = [];
    has = {};
    pending = false;
}

function queueWatcher(watcher) {
    const id = watcher.id; // 对watcher进行去重
    if (has[id] == null) {
        queue.push(watcher); // 并且将watcher存到队列中
        has[id] = true;
        // 等待所有同步代码执行完毕后在执行
        if (!pending) { // 如果还没清空队列，就不要在开定时器了  防抖处理 
            nextTick(flushSchedulerQueue);
            pending = true;
        }
    }
}

export default Watcher

// 在数据劫持的时候 定义defineProperty的时候 已经给每个属性都增加了一个dep

// 1.是想把这个渲染watcher 放到了Dep.target属性上
// 2.开始渲染 取值会调用get方法,需要让这个属性的dep 存储当前的watcher
// 3.页面上所需要的属性都会将这个watcher存在自己的dep中
// 4.等会属性更新了 就重新调用渲染逻辑 通知自己存储的watcher来更新