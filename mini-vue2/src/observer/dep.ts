let id = 0;
class Dep {
    subs: any;
    id: number;
    static target: any;
    constructor() {
        this.subs = [];
        this.id = id++;
    }
    depend() {
        // 我们希望 watcher 可以存放dep 
        Dep.target.addDep(this); // 实现双向记忆的，让watcher记住dep的同时 ，让dep 也记住watcher
        // this.subs.push(Dep.target);
    }
    addSub(watcher) {
        this.subs.push(watcher);
    }
    notify() {
        this.subs.forEach(watcher => watcher.update());
    }
}
Dep.target = null; // 静态属性 就一份
let stack = [];
export function pushTarget(watcher) {
    Dep.target = watcher;// 保留watcher
    stack.push(watcher); // 有渲染watcher 其他的watcher

}

export function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1]; // 将变量删除掉
}
export default Dep
// 多对多的关系 一个属性有一个dep是用来收集watcher的
// dep 可以存多个watcher    
// 一个watcher可以对应多个dep 