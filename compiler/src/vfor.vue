<template>
  <div>
    <span v-for="item in count">{{ item }}</span>
  </div>
</template>

count可能会变化

div-最外层收集的动态节点不一定是同一层
  动态节点 2个

div
  动态节点 3个