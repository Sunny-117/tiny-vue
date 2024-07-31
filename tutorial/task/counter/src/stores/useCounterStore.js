import { defineStore } from 'pinia'
import { ref } from 'vue'
// export const useCounterStore = defineStore('counter', {
//   // 定义数据状态
//   state: () => {
//     return {
//       count: 0
//     }
//   },
//   // 定义了修改数据状态的两个方法
//   actions: {
//     increment() {
//       this.count++
//     },
//     decrement() {
//       this.count--
//     }
//   }
// })
export const useCounterStore = defineStore('counter', () => {
  // 在这里面定义数据状态以及修改数据状态的方法
  const count = ref(0)

  // 修改数据状态的方法
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  return {
    count,
    increment,
    decrement
  }
})
