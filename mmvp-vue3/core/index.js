import { mountElement, diff } from './render.js'
import { effectWactch } from './reactivity.js'
export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            const context = rootComponent.setup()
            let isMounted = false;
            let prevSubTree
            effectWactch(() => {
                if (!isMounted) {
                    // init
                    isMounted = true
                    rootContainer.innerHTML = ''
                    const subTree = rootComponent.render(context)
                    mountElement(subTree, rootContainer)
                    prevSubTree = subTree
                } else {
                    // update
                    const subTree = rootComponent.render(context)// 新节点
                    diff(prevSubTree, subTree)
                    prevSubTree = subTree
                }


                // diff
                // newVnode oldVnode    
            })
        }
    }
}