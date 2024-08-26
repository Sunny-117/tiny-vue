<template>
  <div class="user-list">
    <h2>用户列表</h2>
    <div v-if="userStore.loading">加载中...</div>
    <div v-if="userStore.error" class="error">{{ userStore.getError }}</div>
    <ul>
      <li v-for="user in userStore.users" :key="user.id" class="user-item">
        {{ user.name }}
        <!-- 删除用户仍然是调用的数据仓库提供的 removeUser 方法 -->
        <button @click="userStore.removeUser(user.id)">删除</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { onMounted } from 'vue'

// 先获取数据仓库实例
const userStore = useUserStore()

// 在组件挂载后调用数据仓库提供的 fetchUsers 方法来获取用户列表
onMounted(() => {
  userStore.fetchUsers()
})
</script>

<style scoped>
.user-list {
  width: 100%;
  max-width: 600px;
}

.user-list h2 {
  margin-bottom: 20px;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.user-item button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.user-item button:hover {
  background-color: #45a049;
}

.error {
  color: red;
}
</style>
