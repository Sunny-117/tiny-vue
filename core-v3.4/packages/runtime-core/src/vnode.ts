import { isFunction, isObject, isString, ShapeFlags } from "@vue/shared"
import { isTeleport } from "./components/Teleport"


export const Text = Symbol("text")
export const Fragment = Symbol("fragment")

export function isVnode(value) {
    return !!(value && value.__v_isVnode)
}


export function isSameVnode(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key
}

export function createVnode(type, props, children?, patchFlag?) {
    // type : div h1  h2这种标签  或者 组件
    const shapeFlag = isString(type)
        ? ShapeFlags.ELEMENT // 元素
        : isTeleport(type)
            ? ShapeFlags.TELEPORT
            : isObject(type)
                ? ShapeFlags.STATEFUL_COMPONENT // 组件
                : isFunction(type)
                    ? ShapeFlags.FUNCTIONAL_COMPONENT
                    : 0
    const vnode = {
        __v_isVnode: true,
        type,
        props,
        children,
        key: props?.key, // diff算法需要的key
        el: null, // 虚拟节点对应的真实节点
        shapeFlag,
        ref: props?.ref,
        patchFlag
    }

    if (currentBlock && patchFlag > 0) {
        currentBlock.push(vnode)
    }

    if (children) {
        if (Array.isArray(children)) {
            vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.ARRAY_CHILDREN
        } else if (isObject(children)) {
            vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.SLOTS_CHILDREN
        } else {
            children = String(children)
            vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
        }
    }

    return vnode
}


let currentBlock = null
export function openBlock() {
    currentBlock = [] // 用于收集动态节点
}


export function closeBlock() {
    currentBlock = null
}

export function setupBlock(vnode) {
    vnode.dynamicChildren = currentBlock
    closeBlock()
    return vnode
}

// block有收集虚拟节点的功能
export function createElementBlock(type, props, children, patchFlag?) {
    const vnode = createVnode(type, props, children, patchFlag)
    if (currentBlock) {
        currentBlock.push(vnode)
    }
    return setupBlock(vnode)
}

export function toDisplayString(value) {
    return isString(value)
        ? value
        : value === null
            ? ''
            : isObject(value)
                ? JSON.stringify(value)
                : String(value)
}


export { createVnode as createElementVNode }