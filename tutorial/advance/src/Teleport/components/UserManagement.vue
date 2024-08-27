<template>
  <div class="usermanagement">
    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>邮箱</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button @click="showUserDetails(user)">查看详情</button>
          </td>
        </tr>
      </tbody>
    </table>
    <UserDetailDialog
      :user="selectedUser"
      :visible="isDialogVisible"
      @close="isDialogVisible = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserDetailDialog from './UserDetailDialog.vue'

const users = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' }
])

const selectedUser = ref(null)
const isDialogVisible = ref(false)

const showUserDetails = (user) => {
  selectedUser.value = user
  isDialogVisible.value = true
}
</script>

<style scoped>
.usermanagement {
  position: absolute;
}
</style>
