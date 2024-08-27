<template>
  <div class="container">
    <div class="btns">
      <button @click="show = !show">切换</button>
    </div>
    <!-- 之前是在特定的时间挂对应的 CSS 样式类 -->
    <!-- 现在是在特定的时间触发事件处理函数 -->
    <Transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <p v-if="show" class="box">Hello World</p>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { gsap } from 'gsap'

const show = ref(true)

function beforeEnter(el) {
  // 在元素进入之前，设置初始样式
  // el.style.opacity = 0
  // el.style.transform = 'translateY(-20px)'

  // 设置初始样式
  gsap.set(el, { opacity: 0, y: -20 })
}

function enter(el, done) {
  // 这里设置 setTimeout 是为了让浏览器有时间应用初始样式
  // 将这个函数推到下一个事件循环中执行
  // 避免初始样式和目标样式在同一帧中执行
  // setTimeout(() => {
  //   el.style.transition = 'all 1s'
  //   el.style.opacity = 1
  //   el.style.transform = 'translateY(0)'
  //   done()
  // }, 0)

  // 设置动画
  gsap.to(el, {
    duration: 1,
    opacity: 1,
    y: 0,
    onComplete: done
  })
}

function leave(el, done) {
  // // 因为元素已经在文档中了，直接设置样式即可
  // el.style.transition = 'all 1s'
  // el.style.opacity = 0
  // el.style.transform = 'translateY(-20px)'
  // // 这里的 setTimeout 是为了让动画执行完毕后再调用 done
  // // 保证和过渡时间一致
  // setTimeout(() => {
  //   done()
  // }, 1000)

  gsap.to(el, {
    duration: 1,
    opacity: 0,
    y: -20,
    onComplete: done
  })
}
</script>

<style scoped>
.container {
  text-align: center;
}
.btns button {
  margin: 1em 0.5em;
}
.box {
  width: 200px;
  height: 50px;
  background-color: #42b983;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
}
</style>
