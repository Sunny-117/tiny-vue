<template>
  <div id="app" class="container">
    <h1>待办事项</h1>
    <div class="input-container">
      <input v-model="newTask" placeholder="添加新的任务" />
      <button @click="addTask">添加</button>
    </div>
    <ul>
      <TodoItem v-for="task in tasks" :key="task.id" :task="task" @remove="removeTask(task.id)" />
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLocalStorage, useToggle } from '@vueuse/core'
import TodoItem from './components/TodoItem.vue'

const newTask = ref('')
// 完成这部分代码，使用 useLocalStorage 来存储任务列表
const tasks = useLocalStorage('tasks', [])

const addTask = () => {
  // 完成这部分代码，使用 useToggle 来切换任务的状态
  if (newTask.value.trim() === '') return
  // isCompleted 是初始状态
  // toggleCompleted 是切换状态的方法
  // 后面传递的 false 是初始状态
  const [isCompleted, toggleCompleted] = useToggle(false)
  tasks.value.push({
    id: Date.now(),
    text: newTask.value,
    completed: isCompleted,
    toggleCompleted
  })
  newTask.value = ''
}

const removeTask = (id) => {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}
.input-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
input {
  width: 70%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 20px;
}
button {
  width: 100px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #369870;
}
ul {
  list-style: none;
  padding: 0;
}
</style>
