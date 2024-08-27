<template>
  <div class="login-container">
    <h1 v-if="!userRole">登录</h1>
    <div v-if="userRole">
      <p>
        您当前的身份为： <strong>{{ userRole }}</strong
        >.
      </p>
      <button @click="logoutHandle">退出登录</button>
    </div>
    <form v-else @submit.prevent="loginHandle">
      <input type="text" placeholder="请输入用户名" v-model="username" />
      <input type="password" placeholder="请输入密码" v-model="password" />
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { login, loginout, getCurrentUserRole } from '../router'

const router = useRouter() // 获取路由实例
const username = ref('') // 账号
const password = ref('') // 密码

// 根据 getCurrentUserRole 方法获取当前用户的角色
const userRole = computed(() => {
  const role = ref(getCurrentUserRole())
  if (role.value === 'admin') {
    return '管理员'
  } else if (role.value === 'user') {
    return '普通用户'
  } else {
    return null
  }
})

const loginHandle = () => {
  // 这里应该有具体的登录逻辑，这里只是模拟
  if (username.value === 'admin' && password.value === 'admin') {
    login('admin')
    alert('当前以管理员身份登录')
    router.push({ name: 'Admin' })
  } else if (username.value === 'user' && password.value === 'user') {
    login('user')
    alert('当前以普通用户身份登录')
    router.push({ name: 'User' })
  } else {
    alert('用户名或密码错误')
  }
}

const logoutHandle = () => {
  loginout()
  alert('退出登录成功')
  router.push({ name: 'Home' })
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

input {
  display: block;
  width: calc(100% - 24px);
  margin: 10px auto;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}
</style>
