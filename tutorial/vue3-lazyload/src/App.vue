<template>
  <div>
    <h1>图片懒加载</h1>
    <div class="image-grid">
      <!-- img元素不需要做任何更改，vue3-lazyload库会自动为图片添加lazy属性 -->
      <img
        v-for="(url, index) in imageUrls"
        :key="index"
        v-lazy="url"
        :alt="'image' + (index + 1)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const imageUrls = ref([])

// 生成一些图片的 URL
for (let i = 0; i < 100; i++) {
  imageUrls.value.push(`https://via.placeholder.com/600x400?text=Image+${i}`)
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
/* 添加一部分样式 */
/* 针对图片不同的状态，添加一些样式 */
img[lazy='loading'] {
  filter: blur(5px); /* 模糊 */
  opacity: 0.6;
}

img[lazy='loaded'] {
  filter: none;
  opacity: 1;
}

img[lazy='error'] {
  filter: grayscale(100%);
  opacity: 0.3;
}
</style>
