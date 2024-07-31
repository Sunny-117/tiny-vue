// 模拟异步获取任务列表
export const fetchTasksFromServer = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: '学习Vue3', completed: false },
        { id: 2, title: '学习Pinia', completed: true }
      ])
    }, 1000)
  })
}

// 模拟异步添加任务到服务器
export const addTaskToServer = (task) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...task, id: Date.now() })
    }, 500)
  })
}

// 模拟异步更改任务状态
export const toggleTaskStatusOnServer = (taskId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(taskId)
    }, 500)
  })
}

// 模拟异步删除任务
export const deleteTaskFromServer = (taskId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(taskId)
    }, 500)
  })
}
