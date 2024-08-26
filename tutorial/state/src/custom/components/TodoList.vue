<template>
  <div class="todo-list">
    <h2>任务列表</h2>
    <ul>
      <li v-for="todo in todos" :key="todo.id" :class="{ completed: todo.completed }">
        <span>{{ todo.text }}</span>
        <button @click="toggleTodo(todo.id)" class="complete-btn">
          {{ todo.completed ? '取消完成' : '完成' }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { store } from '../store/index.js'
const todos = store.todos // 拿到待办事项
const toggleTodo = store.toggleTodo // 切换待办事项状态
</script>

<style scoped>
.todo-list {
  margin-bottom: 20px;
}

.todo-list h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #2c3e50;
}

.todo-list ul {
  list-style-type: none;
  padding: 0;
}

.todo-list li {
  background: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-list li.completed {
  background: #d4edda;
  text-decoration: line-through;
}

.complete-btn {
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.complete-btn:hover {
  background-color: #218838;
}
</style>
