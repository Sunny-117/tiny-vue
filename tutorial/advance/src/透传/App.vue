<template>
  <!-- 这些属性在A组件内部都没有声明为Props -->
  <A id="a" class="aa" data-test="test" />
</template>

<script setup>
import A from './components/A.vue'
</script>
