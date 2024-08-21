<template>
  <div>
    <div class="base">
      <Base />
    </div>
    <div class="base">
      <Line />
    </div>
  </div>
</template>

<script setup>
import Base from './components/Base.vue'
import Line from './components/Line.vue'
</script>

<style scoped>
.base {
  width: 500px;
  border: 1px solid;
}
</style>
