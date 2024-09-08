import createVNode from "./vnode.js"
import createResponsive from "./dataResponsive.js"
import render from './render.js'

export default function Vue(options) {
    this.$el = options && options.el;
    this.$data = options && options.data;
    this.$vnode = createVNode(document.querySelector(this.$el))
    // 将data中的数据附加到代理对象——vue实例中
    var that = this;
    createResponsive(this.$data, this, function () {
        // 重新渲染
        that.render();
    })

    this.render(); //初始渲染
}

Vue.prototype.render = function () {
    render(this.$vnode, this);
}