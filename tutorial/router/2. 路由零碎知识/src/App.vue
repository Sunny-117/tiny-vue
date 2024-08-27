<template>
  <div id="app">
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/about">关于</router-link>
      <router-link to="/contact">联系</router-link>
    </nav>

    <!-- 视图或者路由出口 -->
    <router-view></router-view>
    <router-view name="sidebar"></router-view>
  </div>
</template>
