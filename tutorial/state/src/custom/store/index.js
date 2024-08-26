import { reactive } from 'vue'

// 通过 reactive 创建一个响应式对象
// 作为我们自定义的数据仓库
// 回头只要有组件用到这个数据仓库的数据
// 数据仓库数据发生变化，对应的组件会自动更新
export const store = reactive({
  todos: [
    {
      id: 1,
      text: '学习Vue3',
      completed: false
    },
    {
      id: 2,
      text: '学习React',
      completed: false
    },
    {
      id: 3,
      text: '学习Angular',
      completed: false
    }
  ],
  addTodo(todo) {
    this.todos.push(todo)
  },
  // 切换todo的状态
  toggleTodo(id) {
    const todo = this.todos.find((todo) => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }
})
