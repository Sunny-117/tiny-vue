<template>
  <div class="container">
    <input v-model="text" type="text" />
    <p class="result">{{ text }}</p>
  </div>
</template>

<script setup>
import {effect} from 'vue'
import { debounceRef } from './tools/debounceRef.js'
const text = debounceRef('', 2000)
// watchEffect(()=>{
//   console.log("value: ", text.value)
// })
effect(()=>{
  console.log("value: ", text.value)
})
</script>

<style scoped>
.container {
  width: 80%;
  margin: 1em auto;
}
.result {
  color: #333;
}
.container input {
  width: 100%;
  height: 30px;
}
</style>
