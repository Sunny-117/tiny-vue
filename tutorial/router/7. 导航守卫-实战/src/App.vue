<template>
  <div id="app">
    <nav>
      <router-link to="/">主页</router-link>
      <router-link to="/user">用户页</router-link>
      <router-link to="/admin">管理员</router-link>
      <router-link to="/login">登录</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
  text-align: center;
  height: 100vh;
}

nav {
  display: flex;
  justify-content: center;
  background-color: #343a40;
  padding: 10px;
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
</style>
