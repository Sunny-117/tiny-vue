<template>
  <div id="app">
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/user/123">User</router-link>
      <router-link to="/promotion">Promotion</router-link>
      <router-link to="/search?q=vue">Search</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>
