import { effectWactch, reactive } from './core/reactivity.js'
import { h } from './core/h.js'
let a = reactive({
    value: 1
});// 声明一个响应式对象
let b;
effectWactch(() => {
    // b更新逻辑：
    // 1. 最开始会执行一遍
    b = a.value + 10
    console.log(b)// 11 40
})
// 2. 响应式对象的值发生改变之后又会再次执行一遍effect
a.value = 30

export default {
    render(context) {
        // return h('div', {
        //     id: 'app - id',
        //     class: 'showTim'
        // }, String(context.state.count))
        return h('div', {
            id: 'app - ' + context.state.count,
            class: 'showTim'
        }, [h('p', null, String(context.state.count)), h('h1', null, 'haha')])
    },
    setup() {
        // a = 响应式数据
        const state = reactive({
            count: 0
        })
        window.state = state
        return {
            state
        }
    }
}
// App.render(App.setup())