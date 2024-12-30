import { getCurrentInstance } from "../component"
import { h } from "../h"


function nextFrame(fn) {
    requestAnimationFrame(() => {
        requestAnimationFrame(fn)
    })

}

/***
 * enterFrom enterActive enterTo  leaveFrom leaveActive leaveTo
 */
export function resolveTransitionProps(props) {
    const {
        name = "v",
        enterFromClass = `${name}-enter-from`,
        enterActiveClass = `${name}-enter-active`,
        enterToClass = `${name}-enter-to`,
        leaveFromClass = `${name}-leave-from`,
        leaveActiveClass = `${name}-leave-active`,
        leaveToClass = `${name}-leave-to`,
        onBeforeEnter,
        onEnter,
        onLeave
    } = props

    return {
        onBeforeEnter(el) {
            onBeforeEnter && onBeforeEnter(el)
            el.classList.add(enterFromClass)
            el.classList.add(enterActiveClass)
        },
        onEnter(el, done) {
            const resolve = () => {
                el.classList.remove(enterToClass)
                el.classList.remove(enterActiveClass)
                done && done()
            }
            onEnter && onEnter(el, resolve)
            // 不能马上移除 要到下一帧才移除
            nextFrame(() => {
                el.classList.remove(enterFromClass)
                el.classList.add(enterToClass)
                if (!onEnter || onEnter.length <= 1) {
                    el.addEventListener("transitionend", resolve)
                }
            })
        },
        onLeave(el, done) {
            const resolve = () => {
                el.classList.remove(leaveActiveClass)
                el.classList.remove(leaveToClass)
                done && done()
            }
            onLeave && onLeave(el, resolve);
            el.classList.add(leaveFromClass) // 黄色
            document.body.offsetHeight; // 立刻绘制成黄色（过渡）
            el.classList.add(leaveActiveClass) // 红色
            nextFrame(() => {
                el.classList.remove(leaveFromClass)
                el.classList.add(leaveToClass)
                if (!onLeave || onLeave.length <= 1) {
                    el.addEventListener("transitionend", resolve)
                }
            })

        }
    }
}


export function Transition(props, { slots }) {
    // 函数式组件功能比较少，为了方便函数式组件处理了属性
    // 处理属性后传递给有状态组件
    return h(BaseTransitionImple, resolveTransitionProps(props), slots)
}


const BaseTransitionImple = {
    props: {
        onBeforeEnter: Function,
        onEnter: Function,
        onLeave: Function
    },
    setup(props, { slots }) {
        return () => {
            const vnode = slots.default && slots.default()
            if (!vnode) return
            vnode.transition = {
                beforeEnter: props.onBeforeEnter,
                enter: props.onEnter,
                leave: props.onLeave
            }
            return vnode
        }
    }

}