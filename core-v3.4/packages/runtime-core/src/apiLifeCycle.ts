import { currentInstance, setCurrentInstance, unSetCurrentInstance } from "./component"

export const enum LifeCyle {
    BEFORE_MOUNT = 'bm',
    MOUNTED = 'm',
    BEFORE_UPDATE = 'bu',
    UPDATED = 'u'
}


export const onBeforeMount = createHook(LifeCyle.BEFORE_MOUNT)

export const onMounted = createHook(LifeCyle.MOUNTED)

export const onBeforeUpdate = createHook(LifeCyle.BEFORE_UPDATE)

export const onUpdated = createHook(LifeCyle.UPDATED)


function createHook(type) {
    return (hook, target = currentInstance) => {
        if (target) {
            // 看当前钩子是否存放
            const hooks = target[type] || (target[type] = [])
            const wrapHook = () => {
                setCurrentInstance(target)
                hook.call(target)
                unSetCurrentInstance()
            }
            hooks.push(wrapHook)
        }
    }
}

export function invokeArray(fns) {
    for (let fn of fns) {
        fn()
    }
}