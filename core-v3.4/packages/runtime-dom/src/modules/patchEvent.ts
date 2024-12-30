function createInvoker(value) {
    const invoker = (e) => invoker.value(e)
    invoker.value = value
    return invoker
}


export default function patchEvent(el, name, nextValue) {
    // vue_event_invoker 缓存元素先前的绑定事件
    const invokers = el._vei || (el._vei = {})
    const eventName = name.slice(2).toLowerCase() // onClick -> click
    const exsitingInvokers = invokers[name] // 是否存在同名的事件绑定

    if (nextValue && exsitingInvokers) { // 换绑事件
        return exsitingInvokers.value = nextValue
    }
    if (nextValue) { // 新增事件
        const invoker = (invokers[name] = createInvoker(nextValue)) // 创建一个调用函数，并且内部会执行nextValue
        return el.addEventListener(eventName, invoker)
    }

    if (exsitingInvokers) { // 删除原来事件
        el.removeEventListner(eventName, exsitingInvokers)
        invokers[name] = undefined
    }
}