// vdom->dom
export function mountElement(vnode, container) {
    const { tag, children, props } = vnode;
    const el = (vnode.el = document.createElement(tag))
    if (props) {
        for (const key in props) {
            const val = props[key]
            el.setAttribute(key, val)
        }
    }

    // 1. 可以接受一个字符串类型
    if (typeof children === 'string') {
        el.append(document.createTextNode(children))
    } else if (Array.isArray(children)) {
        // 2. 可以接受一个数组
        children.forEach(v => {
            mountElement(v, el)
        })
    }
    // 插入
    container.append(el)
}
// n1: old n2: new
export function diff(n1, n2) {
    console.log(n1, n2)
    // 1. tag
    if (n1.tag !== n2.tag) {
        n1.el.replaceWith(document.createElement(n2.tag))
    } else {
        const el = n2.el = n1.el// 小细节
        // 2. props
        // new: {id: 'foo', class: 'bar', a},
        // old: {id: 'foo', class: 'bar1' , a, b},
        const { props: newProps } = n2;
        const { props: oldProps } = n1;
        if (newProps && oldProps) {
            Object.keys(newProps).forEach(key => {
                const newVal = newProps[key]
                const oldVal = oldProps[key]
                if (newVal !== oldVal) {
                    console.log(111111, n1)
                    n1.el.setAttribute(key, newVal)
                }
            })
        }
        if (oldProps && !newProps) {
            Object.keys(oldProps).forEach(key => {
                if (!newProps[key]) {
                    n1.el.removeAttribute(key)
                }
            })
        }
        // 3. children->暴力    
        const { children: newChildren } = n2
        const { children: oldChildren } = n1
        if (typeof newChildren === 'string') {
            if (typeof oldChildren === 'string') {
                if (newChildren !== oldChildren) {
                    el.textContent = newChildren
                }
            } else if (Array.isArray(oldChildren)) {
                el.textContent = newChildren
            }
        } else if (Array.isArray(newChildren)) {
            if (typeof oldChildren === 'string') {
                el.innerText = ''
                mountElement(n2, el)
            } else if (Array.isArray(oldChildren)) {
                // new {abcdf}
                // old {aecd}
                const length = Math.min(newChildren.length, oldChildren.length)
                for (let index = 0; index < length; index++) {
                    const newVnode = newChildren[index]
                    const oldVnode = oldChildren[index]
                    diff(oldVnode, newVnode)
                }
                if (newChildren.length > length) {
                    // 创建节点
                    for (let index = length; index < newChildren.length; index++) {
                        const newVnode = newChildren[index]
                        mountElement(newVnode)
                    }
                }
                if (oldChildren.length > length) {
                    // 删除节点
                    for (let index = length; index < oldChildren.length; index++) {
                        const oldValue = oldChildren[index];
                        oldValue.el.parent.removeChild(oldVnode.el)
                    }
                }
            }
        }
    }


}