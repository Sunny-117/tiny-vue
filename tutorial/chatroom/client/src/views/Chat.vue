<template>
  <div class="chat-container">
    <header>
      <h1>聊天室</h1>
      <p>【{{ username }}】进入了聊天室</p>
      <p>当前聊天室人数：{{ count }}</p>
    </header>
    <!-- 显示聊天的信息 -->
    <div class="chat-content" ref="chatContainer">
      <div v-for="(item, index) in content" :key="index" :class="getMessageClass(item.type)">
        {{ item.msg }}
      </div>
    </div>
    <div class="chat-input">
      <input
        v-model="msg"
        type="text"
        name="msg"
        id="msg"
        placeholder="输入消息..."
        @keyup.enter="sendMsg"
      />
      <button @click="sendMsg" class="send-button">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter() // 获取到路由实例
const route = useRoute() // 获取到当前路由

const username = ref('')
const count = ref(0)
const msg = ref('')
const content = ref([]) // 存放聊天内容
const chatContainer = ref(null)

const { proxy } = getCurrentInstance()
const socket = proxy.$socket

const sendMsg = () => {
  if (!msg.value) {
    alert('请输入消息')
    return
  }
  socket.emit('msg', {
    username: username.value,
    msg: msg.value
  })
  msg.value = ''
}

const getMessageClass = (type) => {
  if (type === 1) return 'rightBox'
  if (type === 2) return 'leftBox'
  return 'centerBox'
}

const scrollBottom = () => {
  nextTick(() => {
    // 获取到 chatContainer 的 DOM 元素
    const container = chatContainer.value
    if (container) {
      container.scrollTo({
        top: container.scrollHeight, // 滚动到底部
        behavior: 'smooth'
      })
    }
  })
}

onMounted(() => {
  // 在组件挂载的时候，就需要做一些处理，以及监听一些事件
  // 1. 需要做的一些处理：拿到用户名和聊天室的人数
  if (route.params.username) {
    // 获取用户名
    username.value = route.params.username
    // 通过 socket 来触发一个 count 事件获取在线用户数量
    socket.emit('count')
  } else {
    router.replace('/')
  }
  socket.on('count', (data) => {
    count.value = data
  })
  socket.on('msg', (data) => {
    if (data.type) {
      count.value = data.count
      content.value.push({
        type: 3,
        msg:
          data.type === 'loginIn'
            ? `【${data.username}】进入了聊天室`
            : `【${data.username}】离开了聊天室`
      })
    } else {
      // 说明就是普通的聊天消息
      // 将聊天的消息推入到 content 数组中
      if (data.username === username.value) {
        // 当前处于发布消息的用户
        // type 为 1 代表自己发送的消息
        // type 为 2 代表其他用户发送的消息
        // 这个 type 主要是为了处理样式
        content.value.push({
          type: 1,
          msg: data.msg
        })
      } else {
        // 其他用户收到消息
        content.value.push({
          type: 2,
          msg: `【${data.username}】说：${data.msg}`
        })
      }
    }
    scrollBottom()
  })
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5;
}

header {
  text-align: center;
  padding: 20px;
  background-color: #007bff;
  color: white;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

.rightBox,
.leftBox,
.centerBox {
  max-width: 70%;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rightBox {
  background-color: #d1e7dd;
  margin-left: auto;
}

.leftBox {
  background-color: #f8d7da;
  margin-right: auto;
}

.centerBox {
  text-align: center;
  color: #6c757d;
  margin: 10px auto;
}

.chat-input {
  display: flex;
  padding: 10px;
  background-color: #f0f2f5;
  border-top: 1px solid #ccc;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.send-button {
  padding: 10px 20px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-button:hover {
  background-color: #0056b3;
}
</style>
