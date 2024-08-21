<template>
  <li :class="{ completed: isCompleted }">
    <input type="checkbox" v-model="isCompleted" @change="toggleTask" />
    <span>{{ task.text }}</span>
    <button @click="removeTask">删除</button>
  </li>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['remove', 'toggle'])

const isCompleted = computed(() => props.task.completed)

const removeTask = () => {
  emit('remove')
}

const toggleTask = () => {
  props.task.toggleCompleted()
}
</script>

<style scoped>
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
li.completed span {
  text-decoration: line-through;
  color: #999;
}
input[type='checkbox'] {
  margin-right: 10px;
}
button {
  padding: 5px 10px;
  border: none;
  background-color: #ff4d4d;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #ff0000;
}
</style>
