<template>
  <div class="login-container">
    <h1>欢迎来到聊天室</h1>
    <p>请输入你在聊天室的昵称</p>
    <input
      v-model="username"
      type="text"
      name="username"
      id="username"
      placeholder="请输入用户名"
      class="input"
    />
    <button @click="login" class="button">进入聊天室</button>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')

const { proxy } = getCurrentInstance()
const socket = proxy.$socket // 获取到了 socket 实例

const login = () => {
  if (!username.value) {
    alert('请输入用户名')
    return
  }
  // 通过 socket 来触发一个登录事件
  socket.emit('login', username.value)
}

onMounted(() => {
  // 在组件进行挂载的时候，需要监听 login 事件
  socket.on('login', (data) => {
    // 跳转到 chat 页面
    router.push({
      name: 'chat',
      params: {
        username: data.username
      }
    })
  })
})
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

p {
  margin-bottom: 10px;
  color: #555;
}

.input {
  padding: 10px;
  width: 80%;
  max-width: 300px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button {
  padding: 10px 20px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}
</style>
