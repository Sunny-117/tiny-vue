// h.ts
// 1.两个参数 第二个参数可能是属性 也可能是虚拟节点 __v_isVnode
// 2.第二参数是一个数组，儿子
// 3.其他情况下 第二参数就是属性
// 4.第二个参数直接传递非对象的话 相当于文本
// 5.出现三个参数的时候 第二个只能是属性
// 6.超过三个参数，后面都是儿子

import { isObject } from "@vue/shared"
import { createVnode, isVnode } from "./vnode"

export function h(type, propsOrChildren?, children?) {
    let l = arguments.length

    if (l === 2) {
        if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
            // 可能是属性或者虚拟节点
            if (isVnode(propsOrChildren)) {
                return createVnode(type, null, [propsOrChildren])
            } else {
                return createVnode(type, propsOrChildren)
            }
        }
        // 数组或者文本
        return createVnode(type, null, propsOrChildren)
    } else {
        if (l > 3) {
            children = Array.from(arguments).slice(2)
        }
        if (l === 3 && isVnode(children)) {
            children = [children]
        }
        return createVnode(type, propsOrChildren, children)
    }
}

