<template>
  <!-- <div id="aaa" class="bb" data-test="test222"> -->
  <div>
    <!-- <div>{{ $attrs['data-test'] }}</div> -->
    <p v-bind="$attrs">A组件</p>
  </div>
  <div>
    <p>aaa</p>
  </div>
  <!-- <B /> -->
</template>

<script setup>
// import B from './B.vue'
// defineProps(['id', 'class'])
// defineOptions({
//   inheritAttrs: false
// })
import { useAttrs } from 'vue'

const attrs = useAttrs()
console.log(attrs)
</script>
