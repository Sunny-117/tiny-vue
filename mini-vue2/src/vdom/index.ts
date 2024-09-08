import { isReservedTag } from "../util";

export function renderMixin(Vue) { // 用对象来描述dom的解构
    Vue.prototype._c = function () { // 创建虚拟dom元素
        // @ts-ignore
        return createElement(this, ...arguments);
    }

    // 1.当结果是对象时 会对这个对象取值
    Vue.prototype._s = function (val) { // stringify
        return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val;
    }
    Vue.prototype._v = function (text) { // 创建虚拟dom文本元素
        return createTextVnode(text);
    }
    Vue.prototype._render = function () { // _render = render
        const vm = this;
        const render = vm.$options.render;
        let vnode = render.call(vm);
        return vnode;
    }
}
// _c('div',{},_v(),_c())
function createElement(vm, tag, data: any = {}, ...children) {
    // 如果是组件 我产生虚拟节点时需要把组件的构造函数传入
    // new Ctor().$mount()
    // 根据tag名字 需要判断他是不是一个组件

    if (isReservedTag(tag)) {
        return vnode(tag, data, data.key, children)
    } else {
        let Ctor = vm.$options.components[tag];
        // 创建组件的虚拟节点  children就是组件的插槽了
        return createComponent(vm, tag, data, data.key, children, Ctor)
    }
}

function createComponent(vm, tag, data, key, children, Ctor) {
    const baseCtor = vm.$options._base; // Vue
    if (typeof Ctor == 'object') {
        Ctor = baseCtor.extend(Ctor)
    }
    // 给组件增加生命周期 
    data.hook = { // 稍后初始化组件时 会调用此init方法
        init(vnode) {
            let child = vnode.componentInstance = new Ctor({}); // vm.$el
            child.$mount(); // 挂载逻辑 组件的$mount方法中是不传递参数的  
            // vnode.componentInstance.$el 指代的是当前组件的真实dom
        }
    }
    // vue-component-0-app
    return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, { Ctor, children });
}

function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
}
// 用来产生虚拟dom的,操作真实dom浪费性能
function vnode(tag, data, key, children, text?, componentOptions?) {
    return {
        tag,
        data,
        key,
        children,
        text,
        componentOptions // 组件的虚拟节点他多了一个componentOptions属性 用来保存当前组件的构造函数和他的插槽
    }
}