<template>
    <div>
      <h1>图片懒加载示例</h1>
      <div class="image-grid">
        <!-- 一定要配置 once 配置项 -->
        <!-- 否则会在可视状态发生变化时反复加载 -->
        <img
          v-observe-visibility="{
            callback: visibilityChanged,
            once: true,
            intersection: {
              root: null,
              rootMargin: '0px',
              threshold: 0.1
            }
          }"
          v-for="(url, index) in imageUrls"
          :key="index"
          :data-src="url"
          :alt="'Image ' + (index + 1)"
          :src="loadingImage"
          @error="handleError"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // 生成一些图片URL
  const imageUrls = ref([])
  // 往 imageUrls 中添加 50 个图片 URL
  for (let i = 1; i <= 50; i++) {
    imageUrls.value.push(`https://via.placeholder.com/600x400?text=Image+${i}`)
  }
  
  // 加载图片的 url
  const loadingImage = 'https://dummyimage.com/600x400/cccccc/000000&text=Loading'
  // 错误图片的 url
  const errorImage = 'https://dummyimage.com/600x400/ff0000/ffffff&text=Error'
  
  function visibilityChanged(visibility, entry) {
    const img = entry.target
    if (visibility) {
      img.src = img.dataset.src
    }
  }
  
  // 图片加载失败时的处理函数
  function handleError(event) {
    const img = event.target
    img.src = errorImage
  }
  </script>
  
  <style scoped>
  .image-grid {
    display: flex;
    flex-wrap: wrap;
  }
  
  .image-grid img {
    display: block;
    margin: 10px;
    width: 200px;
    height: 150px;
    object-fit: cover;
  }
  </style>
  