<template>
  <div class="user-form">
    <h2>新增用户</h2>
    <form @submit.prevent="addUser">
      <input v-model="name" placeholder="请输入新用户名称" required />
      <button type="submit">添加</button>
    </form>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { ref } from 'vue'

const userStore = useUserStore()
const name = ref('')

const addUser = async () => {
  // 调用数据仓库所提供的 addUser 方法来添加用户
  await userStore.addUser({ name: name.value })
  name.value = ''
}
</script>

<style scoped>
.user-form {
  width: 100%;
  max-width: 400px;
  margin-bottom: 40px;
}

.user-form h2 {
  margin-bottom: 20px;
}

.user-form form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-form input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.user-form button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.user-form button:hover {
  background-color: #45a049;
}
</style>
