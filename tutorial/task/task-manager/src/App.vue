<template>
  <div class="container">
    <h1>任务管理器</h1>
    <div class="task-stats">
      <p>任务总数: {{ taskCount }}</p>
      <p>已完成数: {{ completedTaskCount }}</p>
    </div>
    <input v-model="newTaskTitle" placeholder="添加新任务" @keyup.ctrl.enter="addTask" />
    <TaskList :tasks="pendingTasks" title="待完成任务" />
    <TaskList :tasks="completedTasks" title="已完成任务" />
    <!-- loading框 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import TaskList from './components/TaskList.vue'
import { useTaskStore } from './stores/useTaskStore.js'

const newTaskTitle = ref('')
// 得到数据仓库
const taskStore = useTaskStore()

// 得到数据仓库之后，我们就可以从数据仓库中获取各种数据
const completedTasks = computed(() => taskStore.completedTasks)
const pendingTasks = computed(() => taskStore.pendingTasks)
const taskCount = computed(() => taskStore.taskCount)
const completedTaskCount = computed(() => taskStore.completedTaskCount)
const loading = computed(() => taskStore.loading)

onMounted(async () => {
  await taskStore.fetchTasks()
})

async function addTask() {
  if (newTaskTitle.value.trim()) {
    await taskStore.addTask({
      title: newTaskTitle.value,
      completed: false
    })
    newTaskTitle.value = ''
  }
}
</script>

<style scoped>
.container {
  width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  color: #999;
  font-size: 1.2em;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #22a6b3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
