<template>
  <div>当前鼠标位置: {{ x }}, {{ y }}</div>
</template>

<script setup>
import { useMouse } from './hooks/useMouse'
const { x, y } = useMouse()
</script>

<style scoped></style>
