<template>
  <div id="app">
    <nav>
      <!-- 这里使用的是内置组件router-link来做跳转 -->
      <!-- <router-link to="/">首页</router-link>
      <router-link to="/about">关于</router-link>
      <router-link to="/contact">联系</router-link> -->

      <!-- 接下来使用我们自定义的组件NavigationLink来做跳转 -->
      <NavigateLink to="/">首页</NavigateLink>
      <NavigateLink to="/about">关于</NavigateLink>
      <NavigateLink to="/contact">联系</NavigateLink>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import NavigateLink from './components/NavigationLink.vue'
</script>
