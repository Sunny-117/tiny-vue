import { ShapeFlags } from "@vue/shared"
import { onMounted, onUpdated } from "../apiLifeCycle"
import { getCurrentInstance } from "../component"

// 缓存的是组件  → 组件里有subtree → subtree上有el元素 → 移动到页面中

export const KeepAlive = {
    __isKeepAlive: true,
    props: {
        max: Number
    },
    setup(props, { slots }) {
        // 在这个组件中需要一个dom方法，需要将元素移动到一个div中
        // 还可以卸载某个元素
        const { max } = props
        const keys = new Set() // 记录哪些组件被缓存过
        const cache = new Map() // 缓存表
        let pendingCacheKey = null
        const instance = getCurrentInstance()
        const cacheSubTree = () => {
            cache.set(pendingCacheKey, instance.subTree)
        }
        // KeepAlive组件特有的初始化方法
        const { move, createElement, unmount: _unmount } = instance.ctx.renderer
        instance.ctx.activate = function (vnode, container, anchor) {
            move(vnode, container, anchor) // 将元素直接移动到容器中
        }
        const storageContent = createElement('div')
        instance.ctx.deactivate = function (vnode, container, anchor) {
            move(vnode, storageContent, null) // 将dom元素临时移动到这个div中 但是没有被销毁
        }
        onMounted(cacheSubTree)
        onUpdated(cacheSubTree)

        function reset(vnode) {
            let shapeFlag = vnode.shapeFlag
            if (shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
                shapeFlag -= ShapeFlags.COMPONENT_KEPT_ALIVE
            }

            if (shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
                shapeFlag -= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
            }
            vnode.shapeFlag = shapeFlag
        }

        function unmount(vnode) {
            reset(vnode)
            _unmount(vnode)
        }
        function purneCacheEntry(key) {
            keys.delete(key)
            const cached = cache.get(key)
            if (cached) {
                unmount(cached)  // 真实dom节点删除
                cache.delete(key); // 从缓存中删除
            }
        }
        return () => {
            const vnode = slots.default()
            const comp = vnode.type
            const key = vnode.key === null ? comp : vnode.key
            const cacheVnode = cache.get(key)
            pendingCacheKey = key
            if (cacheVnode) {
                vnode.component = cacheVnode.component // 复用组件实例
                vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE // 表示 不要做初始化操作
                keys.delete(key)
                keys.add(key)
            } else {
                keys.add(key)
                if (max && keys.size > max) {
                    // 说明达到最大缓存个数
                    // 获取set中第一个元素keys.values().next().value
                    purneCacheEntry(keys.values().next().value)
                }
            }
            vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE; // 这个组件不需要真的卸载，卸载的dom 临时放到存储容器中存放
            return vnode
        }
    }
}




export const isKeepAlive = (val) => val.type.__isKeepAlive