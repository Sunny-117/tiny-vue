<template>
  <li :class="[task.completed ? 'completed' : 'pending']">
    <span @click="toggleStatus">{{ task.title }}</span>
    <button @click="deleteTask">删除</button>
  </li>
</template>

<script setup>
import { useTaskStore } from '../stores/useTaskStore'
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})
// 拿到状态仓库
const taskStore = useTaskStore()

async function deleteTask() {
  await taskStore.deleteTask(props.task.id)
}

async function toggleStatus() {
  await taskStore.toggleTaskStatus(props.task.id)
}
</script>

<style scoped>
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  background: #fafafa;
  border-radius: 4px;
  transition: background 0.3s;
  margin-bottom: 10px;
}

li:hover {
  background: #f1f1f1;
}

.completed {
  background-color: #dcedc8;
  text-decoration: line-through;
  color: #777;
}

.pending {
  background-color: #fff9c4;
}

button {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background 0.3s;
}

button:hover {
  background: #ffe5e5;
  color: darkred;
}
</style>
