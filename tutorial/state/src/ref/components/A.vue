<template>
  <div>
    <B ref="childRef" />
    <button @click="clickhandle">change name</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import B from './B.vue'

// 这里的ref是拿来做引用的
const childRef = ref(null)

function clickhandle() {
  if (childRef.value) {
    // 当前存在组件的引用
    console.log(childRef.value.name)
    childRef.value.changeName()
  }
}
</script>
