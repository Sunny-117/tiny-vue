import { defineStore } from 'pinia'
import {
  fetchTasksFromServer,
  addTaskToServer,
  deleteTaskFromServer,
  toggleTaskStatusOnServer
} from '../api/taskApi.js'

export const useTaskStore = defineStore('taskStore', {
  // 状态
  state: () => ({
    tasks: [], // 任务列表 {title: 'xxx', completed: false}
    loading: false // 加载状态
  }),
  // getter 其实就是对上面的状态做二次计算
  // 类似于组件里面的 computed
  getters: {
    // 完成的任务
    completedTasks: (state) => state.tasks.filter((task) => task.completed),
    // 未完成的任务
    pendingTasks: (state) => state.tasks.filter((task) => !task.completed),
    // 任务总数
    taskCount: (state) => state.tasks.length,
    // 完成的任务数量
    completedTaskCount: (state) => state.tasks.filter((task) => task.completed).length
  },
  actions: {
    async fetchTasks() {
      this.loading = true
      const tasks = await fetchTasksFromServer()
      this.tasks = tasks
      this.loading = false
    },
    // 添加任务
    async addTask(task) {
      this.loading = true
      const newTask = await addTaskToServer(task)
      // 接下来更新本地状态仓库
      this.tasks.push(newTask)
      this.loading = false
    },
    // 删除任务
    async deleteTask(taskId) {
      this.loading = true
      // 先删除服务器上的对应任务
      await deleteTaskFromServer(taskId)
      // 然后再删除本地状态仓库中的对应任务
      this.tasks = this.tasks.filter((task) => task.id !== taskId)
      this.loading = false
    },
    // 切换任务状态
    async toggleTaskStatus(taskId) {
      this.loading = true
      // 1. 先切换服务器上的对应任务状态
      await toggleTaskStatusOnServer(taskId)
      // 2. 更新本地仓库中的对应任务状态
      const task = this.tasks.find((task) => task.id === taskId)
      if (task) {
        task.completed = !task.completed
      }
      this.loading = false
    }
  }
})
