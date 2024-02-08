// // v1
// let a = 10;
// let b = a + 10;
// console.log(b)
// a = 20
// b = a + 10;
// console.log(b)

// v2
// let a = 10
// let b;
// update()
// function update() {
//     b = a + 10
//     console.log(b)
// }
// a = 20
// update()

// v3
// a发生变更了，我想让b自动更新：响应式原形
// const { effect, reactive } = require('@vue/reactivity')
import { effectWactch, reactive } from './core/reactivity/index优化2.js'
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