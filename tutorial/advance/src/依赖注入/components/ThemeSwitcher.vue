<template>
  <div class="themeswitcher">
    <h2>主题修改</h2>
    <button @click="changeTheme('blue')">蓝色主题</button>
    <button @click="changeTheme('red')">红色主题</button>
  </div>
</template>

<script setup>
import { inject } from 'vue'
const changeTheme = inject('changeThemeColor')
</script>

<style scoped>
.themeswitcher {
  width: 200px;
  border: 1px solid red;
}
</style>
