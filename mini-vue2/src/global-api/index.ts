import { mergeOptions } from "../util";
import initExtend from './extend'
export function initGlobalApi(Vue){
    Vue.options = {}; // Vue.components Vue.diretive 
    // initMixin()
    Vue.mixin = function (mixin) {
       // 合并对象  （我先考虑生命周期） 不考虑其他的合并 data computed watch
       this.options = mergeOptions(this.options,mixin);
    }

    Vue.options._base = Vue; // _base 最终的Vue的构造函数我保留在options对象中
    Vue.options.components = {}; // 全局组件


    initExtend(Vue);

    // initAssetRegisters....  directive filter
    Vue.component = function (id,definition) {
        // Vue.extend 
        definition.name = definition.name || id; // 默认会以name属性为准
        // 根据当前组件对象 生成了一个子类的构造函数
        // 用的时候得 new definition().$mount()
        definition = this.options._base.extend(definition); // 永远是父类

        // Vue.component 注册组件 等价于  Vue.options.components[id] = definition
        Vue.options.components[id] = definition;
    }
}