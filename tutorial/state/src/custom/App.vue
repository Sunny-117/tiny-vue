<template>
  <div id="app">
    <h1>任务管理器</h1>
    <div class="todo-container">
      <TodoList />
      <AddTodo />
    </div>
  </div>
</template>

<script setup>
import TodoList from './components/TodoList.vue'
import AddTodo from './components/AddTodo.vue'
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1 {
  font-size: 36px;
  margin-bottom: 20px;
  color: #343a40;
}

.todo-container {
  width: 400px;
  margin: 0 auto;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #495057;
}
</style>
