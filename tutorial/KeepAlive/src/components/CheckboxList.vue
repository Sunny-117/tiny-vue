<template>
  <div class="component">
    <h1>复选框列表</h1>
    <div v-for="(item, index) in items" :key="index" class="checkbox-item">
      <label>
        <div>{{ item.name }}</div>
        <input type="checkbox" v-model="item.checked" />
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { name: '选项 1', checked: false },
  { name: '选项 2', checked: false },
  { name: '选项 3', checked: false }
])
</script>

<script>
export default {
  name: 'CheckboxList'
}
</script>

<style>
.component {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
h1 {
  color: #333;
}
.checkbox-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
label {
  font-size: 1.2em;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.component label > div {
  width: 100px;
}
input[type='checkbox'] {
  margin-left: 10px;
}
</style>
