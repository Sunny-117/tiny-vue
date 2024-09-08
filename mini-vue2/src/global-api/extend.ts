import { mergeOptions } from "../util";

export default function initExtend(Vue){
    let cid = 0;
    // 核心就是创造一个子类继承我们的父类
    Vue.extend = function (extendOptions) {
        // 如果对象相同 应该复用构造函数 （缓存）
        const Super = this;
        const Sub = function VueComponent(options) {
            this._init(options);
        }
        Sub.cid = cid++;
        // 子类要继承父类原型上的方法, 原型继承
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        // 处理其他的属性 mixin component ....
        Sub.options = mergeOptions(
            Super.options,
            extendOptions
        )
        Sub.components = Super.components;
        // ....    
        return Sub;
    }
}


// 组件的渲染流程
// 1.调用Vue.component
// 2.内部用的是Vue.extend 就是产生一个子类来继承父类 
// 3.等会创建子类实例时会调用父类的_init方法，在$mount即可
// 4.组件的初始化就是 new 这个组件的构造函数并且调用$mount方法
// 5.创建虚拟节点 根据标签晒出组件对应，生成组件的虚拟节点 componentOptions里面包含Ctor,children 

// 6.组件创建真实dom时 （先渲染的是父组件） 遇到是组件的虚拟节点时，去调用init方法，让组件初始化并挂载， 组件的$mount无参数会把渲染后的dom放到 vm.$el上 =》 vnode.componentInstance中,这样渲染时就 获取这个对象的$el属性来渲染