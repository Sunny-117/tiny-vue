<template>
  <div id="app">
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup></script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
  text-align: center;
}

nav {
  display: flex;
  justify-content: center;
  background-color: #343a40;
  padding: 10px;
  margin-bottom: 20px;
}

nav a {
  margin: 0 15px;
  color: #fff;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
