<template>
  <div class="container">
    <div class="btns">
      <button @click="prev">上一张</button>
      <button @click="next">下一张</button>
    </div>
    <!-- 根据不同的方向，name不同 -->
    <!-- 下一张：next-image -->
    <!-- 上一张：prev-image -->
    <Transition :name="`${direction}-image`">
      <img class="image" :key="curIndex" :src="curImage" />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 定义一个图片索引
const curIndex = ref(0)

// 图片数组
const images = [
  'https://10.idqqimg.com/eth/ajNVdqHZLLAJib8odhz8Th2Z4Gat0axooYaxANJlaLEwTomre0hx8Y5yib6FxDZxsgiaYG1W2ETbrU/130?tp=webp',
  'https://10.idqqimg.com/eth/ajNVdqHZLLDqYf0PtFibF9JNOnRbAw7DicWPicmfRkQwPeK2mnZ7ZJzZFdsCwCWdcwhEqoVphXiaDHE/130?tp=webp',
  'https://thirdqq.qlogo.cn/g?b=sdk&k=LaERpMuX1ZjWTQmhrhst6Q&s=100&t=0&tp=webp',
  'https://10.idqqimg.com/eth/ajNVdqHZLLDXIjdTYsqbfkxiaibd3lYGEgfiaEwficYfK2ogZDicCxaKibVibGA2Cj2ltgOvCm1tbRs1iac/130?tp=webp',
  'https://thirdqq.qlogo.cn/g?b=sdk&k=pfIficic6WRliaLULZudVI5Tw&s=640&t=1600139160&tp=webp'
]

// 定义一个移动方向
const direction = ref('next')

// 根据当前索引返回对应图片
const curImage = computed(() => images[curIndex.value])
// 最大索引值
const maxIndex = computed(() => images.length - 1)

function prev() {
  curIndex.value--
  if (curIndex.value < 0) {
    // 跳转到最后一张
    curIndex.value = maxIndex.value
  }
  direction.value = 'prev'
}

function next() {
  curIndex.value++
  if (curIndex.value > maxIndex.value) {
    // 跳转到第一张
    curIndex.value = 0
  }
  direction.value = 'next'
}
</script>

<style scoped>
/* 容器样式 */
.container {
  text-align: center;
}

/* 按钮样式 */
.btns button {
  margin: 1em 0.5em;
}

/* 图片样式 */
.image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  margin-left: -100px;
  top: 100px;
}

/* active阶段需要过渡 */
.next-image-enter-active,
.next-image-leave-active,
.prev-image-enter-active,
.prev-image-leave-active {
  transition: 0.5s;
}

.next-image-enter-from,
.next-image-leave-to,
.prev-image-enter-from,
.prev-image-leave-to {
  opacity: 0;
}

.next-image-enter-from,
.prev-image-leave-to {
  transform: translateX(200px);
}

.next-image-leave-to,
.prev-image-enter-from {
  transform: translateX(-200px);
}
</style>
