<template>
  <div id="app">
    <nav>
      <router-link to="/">主页</router-link>
      <router-link to="/about">关于</router-link>
      <router-link to="/contact">联系</router-link>
      <router-link to="/about#section1">About第一小节</router-link>
      <router-link to="/about#section2">About第二小节</router-link>
      <router-link to="/about#section3">About第三小节</router-link>
    </nav>
    <div class="content">
      <router-view v-slot="{ Component, route }">
        <Transition name="fade">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </router-view>
    </div>
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
  position: fixed;
  top: 0;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  background-color: #343a40;
  padding: 10px;
  z-index: 1000;
}

nav a {
  margin: 0 15px;
  color: #fff;
  text-decoration: none;
  line-height: 30px;
}

nav a:hover {
  text-decoration: underline;
}

.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}

.content {
  margin-top: 30px;
}

/* 增加过渡特效 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
