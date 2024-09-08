import compile from "./compile.js"
/**
 * 渲染一个虚拟节点（将文本的虚拟节点进行编译）
 */
export default function render(vnode, envObj) {
    if (vnode.realDom.nodeType === Node.TEXT_NODE) {
        //如果是文本节点
        //将vnode.template编译，将编译结果设置到realDom.nodeValue中
        var result = compile(vnode.template, envObj);
        if (result !== vnode.realDom.nodeValue) {
            vnode.realDom.nodeValue = result;
        }
    }
    else {
        //如果不是文本节点
        for (var i = 0; i < vnode.children.length; i++) {
            var childNode = vnode.children[i];
            render(childNode, envObj);
        }
    }
}