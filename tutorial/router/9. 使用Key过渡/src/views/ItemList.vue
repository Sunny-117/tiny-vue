<template>
  <div class="container">
    <h1>项目列表</h1>
    <ul>
      <li v-for="item in items" :key="item.id">
        <router-link :to="{ name: 'ItemDetail', params: { id: item.id } }">{{
          item.name
        }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 1, name: '项目1' },
  { id: 2, name: '项目2' },
  { id: 3, name: '项目3' }
])
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px 0;
}
</style>
