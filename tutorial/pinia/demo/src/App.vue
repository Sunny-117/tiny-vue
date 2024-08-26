<template>
  <div id="app">
    <h1>用户管理系统</h1>
    <div class="container">
      <UserForm />
      <UserList />
    </div>
  </div>
</template>

<script setup>
import UserForm from './components/UserForm.vue'
import UserList from './components/UserList.vue'
</script>

<style scoped>
#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
