<template>
    <div>
      <h1>使用示例</h1>
      <!-- 该元素进入视口/离开视口时，会触发回调函数 -->
      <div
        v-observe-visibility="{
          callback: visibilityChange,
          intersection: {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
          }
        }"
        class="test"
      >
        观察该元素可见性
      </div>
    </div>
  </template>
  
  <script setup>
  function visibilityChange(isVisible) {
    console.log(isVisible ? '进入视口' : '离开视口')
  }
  </script>
  
  <style scoped>
  .test {
    height: 200px;
    margin-top: 1000px;
    background-color: #aa2222;
  }
  </style>
  