<template>
  <div>这是B组件</div>
  <div>{{ name }}</div>
</template>

<script setup>
import { ref } from 'vue'
const name = ref('bill')
function changeName() {
  name.value = 'john'
}

// 需要将数据和方法进行暴露
defineExpose({
  name,
  changeName
})
</script>
