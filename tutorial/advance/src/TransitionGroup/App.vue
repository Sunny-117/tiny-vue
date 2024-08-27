<template>
  <div class="container">
    <input
      type="text"
      v-model="newContent"
      class="todo-content"
      placeholder="请输入新的待办事项"
      @keypress.enter="addNewItem"
    />
  </div>
  <TransitionGroup tag="ul" name="fade" class="todo-container">
    <li v-for="item in todos" :key="item.id" class="todo">
      <span>{{ item.content }}</span>
      <button @click="deleteItem(item)">删除</button>
    </li>
  </TransitionGroup>
</template>

<script setup>
import { ref } from 'vue'

const newContent = ref('')

/**
 * 生成随机id
 */
function randomId() {
  return Math.random().toString(36).substr(2, 9)
}

const todos = ref([
  { id: randomId(), content: '学习Vue' },
  { id: randomId(), content: '看电影' },
  { id: randomId(), content: '听音乐' }
])

function deleteItem(item) {
  todos.value = todos.value.filter((todo) => todo.id !== item.id)
}

function addNewItem() {
  if (newContent.value.trim() === '') return
  todos.value.unshift({
    id: randomId(),
    content: newContent.value
  })
  newContent.value = ''
}
</script>

<style scoped>
.container {
  width: 600px;
  margin: 1em auto;
  padding: 1.5em;
  border-radius: 5px;
}
.shuffle {
  margin: 1em 0;
}
.todo-content {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  border-radius: 5px;
  outline: none;
  font-size: 1.3em;
  padding: 0 1em;
  border: 1px solid #ccc;
}
.todo-container {
  list-style: none;
  padding: 0;
  margin: 1em 0;
}
.todo {
  padding: 0.5em 0;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
}

/* xxx-enter-active 新元素进入的时候会挂这个类 */
/* xxx-leave-active 元素离开的时候会挂这个类 */
/* xxx-move 其他元素涉及到移动的时候，会挂这个类 */

.fade-enter-active,
.fade-leave-active,
.fade-move {
  transition: 0.5s;
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
