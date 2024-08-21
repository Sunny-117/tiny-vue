<template>
  <div id="app">
    <h1>待办事项</h1>
    <div class="newTask-container">
      <input type="text" v-model="newItem" class="newTaskInput" placeholder="添加新任务" />
      <button @click="addNewTask">添加新任务</button>
    </div>
    <div class="list-container">
      <div>
        <h2>未完成</h2>
        <!-- 任务：显示未完成的任务，并且可以自由拖拽 -->

        <!-- 这是普通的显示列表内容 -->
        <!-- <div v-for="item in list1" :key="item.id" class="task">
          {{ item.text }}
        </div> -->

        <!-- 使用vuedraggable插件实现拖拽 -->
        <draggable v-model="list1" group="tasks" @start="drag = true" @end="endHandle" itemKey="id">
          <template #item="{ element }">
            <TransitionGroup name="fade" tag="div">
              <div class="task" :key="element.id">{{ element.text }}</div>
            </TransitionGroup>
          </template>
        </draggable>
      </div>
      <div>
        <h2>已完成</h2>
        <!-- 任务：显示已完成的任务，并且可以自由拖拽 -->
        <!-- <div v-for="item in list2" :key="item.id" class="task">
          {{ item.text }}
        </div> -->

        <!-- 使用vuedraggable插件实现拖拽 -->
        <draggable v-model="list2" group="tasks" @start="drag = true" @end="endHandle" itemKey="id">
          <template #item="{ element }">
            <TransitionGroup name="fade" tag="div">
              <div class="task" :key="element.id">{{ element.text }}</div>
            </TransitionGroup>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'

// 未完成列表
const list1 = ref([
  { id: 1, text: '学习Vue' },
  { id: 2, text: '书写Draggable案例' },
  { id: 3, text: '看10页书' }
])

// 已完成列表
const list2 = ref([
  { id: 4, text: '玩游戏' },
  { id: 5, text: '听音乐' },
  { id: 6, text: '看电影' }
])

const newItem = ref('')

const addNewTask = () => {
  if (!newItem.value) return
  list1.value.push({ id: Date.now(), text: newItem.value })
  newItem.value = ''
}

const endHandle = () => {
  console.log('拖拽结束')
}
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}

#app {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.newTask-container {
  display: flex;
  width: 60%;
  justify-content: space-between;
  margin: 20px auto;
}

.newTask-container input {
  padding: 10px;
  width: 70%;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.newTask-container button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.list-container {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

h2 {
  text-align: center;
  color: #666;
  margin-bottom: 10px;
}

.task {
  padding: 15px;
  margin: 5px 0;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  cursor: move;
  transition:
    background-color 0.3s,
    transform 0.3s;
}

.task:hover {
  background-color: #369870;
  transform: scale(1.02);
}

/* 过渡相关的样式 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
