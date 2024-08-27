<template>
  <div class="container">
    <h1>项目详情</h1>
    <p>项目ID: {{ id }}</p>
    <p>项目名称: {{ item.name }}</p>
    <router-link to="/">返回列表</router-link>
    <br />
    <div>
      <router-link
        v-for="otherItem in otherItems"
        :key="otherItem.id"
        :to="{ name: 'ItemDetail', params: { id: otherItem.id } }"
        class="other-item"
      >
        查看{{ otherItem.name }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = ref(route.params.id)
const item = ref({ id: id.value, name: `Item ${id.value}` })

onMounted(() => {
  // 模拟获取详细信息
  item.value = { id: id.value, name: `Item ${id.value}` }
})

watch(
  () => route.params.id,
  (newId) => {
    id.value = newId
    item.value = { id: id.value, name: `Item ${id.value}` }
  }
)

const otherItems = computed(() => {
  return [
    { id: 1, name: '项目1' },
    { id: 2, name: '项目2' },
    { id: 3, name: '项目3' }
  ].filter((i) => i.id !== id.value)
})
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.other-item {
  margin: 10px;
}
</style>
