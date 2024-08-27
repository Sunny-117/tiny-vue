<template>
  <div class="login-container">
    <div class="container">
      <h1 class="title">智能云端学生平台</h1>
      <el-form :model="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { setRoutesbyRole } from '../router'
import { useRouter } from 'vue-router'
import { routesMap } from '../router/roles'

// 和表单做数据双向绑定
const loginForm = ref({
  username: '',
  password: ''
})

const router = useRouter()

// 登录对应的方法
const handleLogin = () => {
  // 这里本来应该是拿到用户名和密码，然后和服务器端进行交互
  // 我们这里做一个简化
  let userRole = '' // 存储用户的角色
  if (loginForm.value.username === 'admin' && loginForm.value.password === 'admin') {
    userRole = 'admin'
  } else if (loginForm.value.username === 'teacher' && loginForm.value.password === 'teacher') {
    userRole = 'teacher'
  } else if (loginForm.value.username === 'student' && loginForm.value.password === 'student') {
    userRole = 'student'
  } else {
    alert('用户名或密码错误')
    return
  }

  // 存储用户角色信息
  localStorage.setItem('userRole', userRole)
  // 存储登录状态
  localStorage.setItem('isLogin', true)

  // 动态的添加路由
  setRoutesbyRole(userRole)

  // 获取该角色的第一个路由
  const roleRoutes = routesMap[userRole] || []
  const firstRoute = roleRoutes.length > 0 ? roleRoutes[0].path : '/'

  // 设置actionIndex
  localStorage.setItem('activeIndex', firstRoute)

  // 跳转到首页
  router.push(firstRoute)
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.title {
  text-align: center;
  font-weight: 200;
}

.el-form {
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>
