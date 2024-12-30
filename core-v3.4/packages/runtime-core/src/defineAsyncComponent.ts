import { ref } from "@vue/reactivity"
import { isFunction } from "@vue/shared"
import { h } from "./h"

export function defineAsyncComponent(options) {
    if (isFunction(options)) {
        options = { loader: options }
    }
    return {
        setup() {
            const { loader, errorComponent, timeout, delay, loadingComponent, onError } = options
            const loaded = ref(false)
            const error = ref(false)
            const loading = ref(false)
            const loadingTimer = ref(null)
            if (delay) {
                loadingTimer.value = setTimeout(() => {
                    loading.value = true
                }, delay);
            }
            let Comp = null
            let attemps = 0

            function loadFun() {
                return loader().catch(err => {
                    if (onError) {
                        return new Promise((resolve, reject) => {
                            const retry = () => resolve(loadFun())
                            const fail = () => reject(err)
                            onError(err, retry, fail, ++attemps)
                        })
                    } else {
                        throw error  // 将错误继续传递
                    }
                })
            }

            loadFun()
                .then((comp) => {
                    Comp = comp
                    loaded.value = true
                })
                .catch((err) => {
                    error.value = err
                })
                .finally(() => {
                    loading.value = false
                    clearTimeout(loadingTimer.value)
                })
            if (timeout) {
                setTimeout(() => {
                    error.value = true
                    throw new Error("组件加载超时失败")
                }, timeout);
            }

            const placeHolder = h("div")
            return () => {
                if (loaded.value) {
                    return h(Comp)
                }
                else if (error.value && errorComponent) {
                    return h(errorComponent)
                }
                else if (loading.value && loadingComponent) {
                    return h(loadingComponent)
                }
                else {
                    return placeHolder
                }
            }
        }
    }
}