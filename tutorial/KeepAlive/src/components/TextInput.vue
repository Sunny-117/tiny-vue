<template>
  <div>
    <h1>文本输入</h1>
    <input type="text" v-model="text" placeholder="请输入内容..." />
    <p>你输入的内容为：{{ text }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const text = ref('')
console.log('文本框组件【创建完成】')
onBeforeMount(()=>{
  console.log('文本框组件【即将挂载】')
})
onMounted(() => {
  console.log('文本框组件【挂载完成】')
})
onBeforeUnmount(() => {
  console.log('文本框组件【即将卸载】')
})
onUnmounted(() => {
  console.log('文本框组件【卸载完成】')
})
</script>

<script>
export default {
  name: 'TextInput'
}
</script>

<style>
h1 {
  color: #333;
}
input {
  padding: 10px;
  font-size: 1em;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
}
p {
  font-size: 1.2em;
}
</style>
