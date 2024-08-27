<template>
  <div>
    <div v-time="timeNow"></div>
    <div v-time="timeBefore"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 当前时间
const timeNow = ref(new Date().getTime())
// 之前时间
const timeBefore = ref(1488930695721)
</script>

<style scoped></style>
