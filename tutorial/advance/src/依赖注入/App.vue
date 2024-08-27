<template>
  <div class="app">
    <h1>App组件</h1>
    <ThemeSwitcher />
    <UserInfo />
    <ConfigDisplay />
  </div>
</template>

<script setup>
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import UserInfo from './components/UserInfo.vue'
import ConfigDisplay from './components/ConfigDisplay.vue'
</script>

<style scoped>
/* .app {
  width: 500px;
  height: 500px;
  border: 1px solid;
} */
</style>
