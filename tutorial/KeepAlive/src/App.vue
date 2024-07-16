<template>
  <div id="app">
    <nav>
      <router-link to="/">计数器</router-link>
      <router-link to="/input">文本输入</router-link>
      <router-link to="/checkboxlist">复选框</router-link>
      <router-link to="/timer">计时器</router-link>
    </nav>
    <router-view v-slot="{ Component }">
      <keep-alive :max="3">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
}
#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
nav {
  margin-bottom: 20px;
}
nav a {
  margin-right: 10px;
  text-decoration: none;
  color: #42b983;
}
nav a:hover {
  text-decoration: underline;
}
</style>
