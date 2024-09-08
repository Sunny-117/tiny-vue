import { patch } from "./vdom/patch";
import Watcher from "./observer/watcher";

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function(vnode) {
        const vm = this;
        const prevVnode = vm._vnode; // 如果第一次_vnode不存在
        if (!prevVnode) {
            //  这里需要区分一下 到底是首次渲染还是更新
            // 用新的创建的元素 替换老的vm.$el
            vm.$el = patch(vm.$el, vnode);
        } else {
            // 拿上一次的vnode 和 本次做对比
            vm.$el = patch(prevVnode, vnode)
        }
        vm._vnode = vnode; // 保存第一次的vnode
    }
}

export function mountComponent(vm, el) {

    vm.$el = el;
    // 调用render方法去渲染 el属性
    // 先调用render方法创建虚拟节点，在将虚拟节点渲染到页面上
    callHook(vm, 'beforeMount')
    let updateComponent = () => {
        vm._update(vm._render()); // 渲染 、 更新
    }
    // 这个watcher是用于渲染的 目前没有任何功能  updateComponent()

    // 初始化就会创建watcher
    let watcher = new Watcher(vm, updateComponent, () => {
        callHook(vm, 'updated')
    }, true); // 渲染watcher 只是个名字

    // 要把属性 和 watcher绑定在一起 

    callHook(vm, 'mounted');
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook]; // vm.$options.created  = [a1,a2,a3]
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm); // 更改生命周期中的this
        }
    }
}