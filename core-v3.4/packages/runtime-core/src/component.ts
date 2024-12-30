import { proxyRefs, reactive } from "@vue/reactivity"
import { hasOwn, isFunction, ShapeFlags } from "@vue/shared"

export function createComponentInstance(vnode, parent) {
    const instance = {
        data: null, // 状态
        vnode, // 组件的虚拟节点
        subTree: null, // 子树
        isMounted: false, // 是否挂载完成
        update: null, // 组件更新函数
        props: {},
        attrs: {},
        slots: {},
        propsOptions: vnode.type.props,// 用户声明的哪些属性是组件的属性
        component: null,
        proxy: null, // 用来代理props attrs data 让用户更方便的访问
        setupState: {}, // setup函数执行的结果
        exposed: {},
        parent,
        provides: parent ? parent.provides : Object.create(null),
        ctx: {} as any, // 如果是keepAlive组件 就把dom api放到这个属性上
    }

    return instance
}

// 初始化属性
const initProps = (instance, rawProps) => {
    const attrs = {}
    const props = {}

    const propsOptions = instance.propsOptions || {}

    if (rawProps) {
        for (let key in rawProps) {
            const value = rawProps[key]
            if (key in propsOptions) {
                props[key] = value
            } else {
                attrs[key] = value
            }
        }
    }

    instance.attrs = attrs
    instance.props = reactive(props)
}

const initSlots = (instance, children) => {
    if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
        instance.slots = children
    } else {
        instance.slots = {}
    }
}

const handler = {
    get(target, key, value) {
        const { data, props, setupState } = target
        if (data && hasOwn(data, key)) {
            return data[key]
        } else if (props && hasOwn(props, key)) {
            return props[key]
        } else if (setupState && hasOwn(setupState, key)) {
            return setupState[key]
        }

        const getter = publicProperty[key]
        if (getter) {
            return getter(target)
        }
    },
    set(target, key, value, receiver) {
        const { data, props, setupState } = target
        if (data && hasOwn(data, key)) {
            data[key] = value
        } else if (props && hasOwn(props, key)) {
            // props[key] = value
            console.warn("props are readonly")
            return false
        } else if (setupState && hasOwn(setupState, key)) {
            setupState[key] = value
        }
        return true
    }
}

const publicProperty = {
    $attrs: (instance) => instance.attrs,
    $slots: (instance) => instance.slots
}

export function setupComponent(instance) {
    // 根据propsOptions 来区分出props,attrs
    const { vnode } = instance
    initProps(instance, vnode.props)
    initSlots(instance, vnode.children)
    instance.proxy = new Proxy(instance, handler)
    const { data = () => { }, render, setup } = vnode.type

    if (setup) {
        const setupContext = {
            slots: instance.slots,
            attrs: instance.attrs,
            emit: (event, payload) => {
                // myevent -> onMyEvent
                const eventName = `on${event[0].toUpperCase() + event.slice(1)}`
                const handler = instance.vnode.props[eventName]
                handler && handler(payload)
            },
            expose: (value) => {
                instance.exposed = value
            }
        }
        setCurrentInstance(instance) //  设置全局当前实例
        const setupResult = setup(instance.props, setupContext)
        unSetCurrentInstance() // setup执行完 清空全局当前实例
        if (isFunction(setupResult)) {
            instance.render = setupResult
        } else {
            instance.setupState = proxyRefs(setupResult)
        }
    }

    if (!isFunction(data)) {
        return console.warn("data options must be a function ")
    } else {
        instance.data = reactive(data.call(instance.proxy))
    }

    if (!instance.render) {
        instance.render = render
    }
}

export let currentInstance = null

export const getCurrentInstance = () => {
    return currentInstance
}

export const setCurrentInstance = (instance) => {
    currentInstance = instance
}

export const unSetCurrentInstance = () => {
    currentInstance = null
}