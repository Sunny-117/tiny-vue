import { currentInstance } from "./component";

export function provide(key, value) {
    // debugger
    if (!currentInstance) return
    const parentProvide = currentInstance.parent?.provides // 获取父组件的provide
    let provides = currentInstance.provides
    if (parentProvide === provides) {
        // 如果子组件新增了provides 需要拷贝一份全新的
        provides = currentInstance.provides = Object.create(null)
    }
    provides[key] = value
}


export function inject(key, defaultValue) {
    if (!currentInstance) return
    const provides = currentInstance.parent?.provides
    if (provides && key in provides) {
        return provides[key]
    } else {
        return defaultValue
    }
}