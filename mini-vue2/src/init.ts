import { initState } from "./state";
import { compileToFunctions } from "./compiler/index";
import { mountComponent, callHook } from "./lifecycle";
import { mergeOptions } from "./util";

export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this;
        // Vue.options, 用户定义的
        vm.$options = mergeOptions(vm.constructor.options, options); // 需要将用户自定义的options 和全局的options做合并
        callHook(vm, 'beforeCreate')

        initState(vm); // 初始化状态
        callHook(vm, 'created')

        if (vm.$options.el) { // 挂载的逻辑
            vm.$mount(vm.$options.el)
        }
    }
    // 1.render 2.template 3.外部template  （el存在的时候）
    Vue.prototype.$mount = function(el) {
        // 挂载操作
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);
      

        if (!options.render) {
            let template = options.template;
            if (!template && el) {
                template = el.outerHTML;
            }
            // template => render方法
            // 1.处理模板变为ast树 2.标记静态节点 3.codegen=>return 字符串 4.new Function + with (render函数)
            const render = compileToFunctions(template);
            options.render = render
        }
        // 渲染时用的都是这个render方法

        // 需要挂载这个组件
        mountComponent(vm, el);
    }
}