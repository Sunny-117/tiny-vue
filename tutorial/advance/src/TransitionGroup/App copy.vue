<template>
  <div class="container">
    <div class="btns">
      <button @click="addItem">添加项目</button>
      <button @click="removeItem">移除项目</button>
    </div>
    <TransitionGroup name="fade" tag="ul">
      <li v-for="item in items" :key="item" class="box">{{ item }}</li>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref(['内容1', '内容2', '内容3'])

const addItem = () => {
  items.value.push(`内容${items.value.length + 1}`)
}

const removeItem = () => {
  items.value.pop()
}
</script>

<style>
.container {
  text-align: center;
}
.btns button {
  margin: 1em 0.5em;
}
.box {
  background-color: #42b983;
  color: white;
  margin: 5px auto;
  padding: 10px;
  width: 200px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
