<template>
  <!-- 外层容器 -->
  <div ref="list" class="infinite-list-container" @scroll="scrollHandler">
    <!-- 该元素高度为总列表的高度，目的是为了形成滚动 -->
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>
    <!-- 该元素为可视区域，里面就是一个一个列表项 -->
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div
        class="infinite-list-item"
        v-for="item in visibleData"
        :key="item.id"
        :style="{
          height: `${itemSize}px`,
          lineHeight: `${itemSize}px`
        }"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
const props = defineProps({
  listData: {
    type: Array,
    default: () => []
  },
  itemSize: {
    type: Number,
    default: 150
  }
})

// 引用container元素
const list = ref(null)
// 可视区域高度
const screenHeight = ref(0)
// 开始索引
const startIndex = ref(0)
// 结束索引
const endIndex = ref(0)
// 初始的偏移量
const startOffset = ref(0)

// 列表总高度
const listHeight = computed(() => props.listData.length * props.itemSize)
// 可显示的列表项数
const visibleCount = computed(() => Math.ceil(screenHeight.value / props.itemSize))
// 列表显示数据
const visibleData = computed(() =>
  props.listData.slice(startIndex.value, Math.min(endIndex.value, props.listData.length))
)

// 向下位移的距离
const getTransform = computed(() => `translate3d(0, ${startOffset.value}px, 0)`)

// 滚动对应的处理函数
const scrollHandler = () => {
  // 这里要做的事情主要就是更新各项数据
  let scrollTop = list.value.scrollTop
  startIndex.value = Math.floor(scrollTop / props.itemSize)
  endIndex.value = startIndex.value + visibleCount.value
  startOffset.value = scrollTop - (scrollTop % props.itemSize)
}

onMounted(() => {
  // 获取可视区域高度
  screenHeight.value = list.value.clientHeight
  startIndex.value = 0
  endIndex.value = startIndex.value + visibleCount.value
})
</script>

<style scoped>
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>
