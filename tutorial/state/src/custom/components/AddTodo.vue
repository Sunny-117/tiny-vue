<template>
  <div class="add-todo">
    <input type="text" v-model="newTodo" placeholder="请输入新的待办事项" />
    <button @click="addTodo">添加任务</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { store } from '../store/index.js'
const newTodo = ref('') // 新的待办事项

const addTodo = () => {
  if (newTodo.value.trim() === '') return
  store.addTodo({
    id: Date.now(),
    text: newTodo.value,
    completed: false
  }) // 添加新的待办事项
  newTodo.value = '' // 清空输入框
}
</script>

<style scoped>
.add-todo {
  display: flex;
  margin-top: 20px;
}

.add-todo input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
  flex: 1;
}

.add-todo button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-todo button:hover {
  background-color: #0056b3;
}
</style>
