<template>
  <div>
    <h1>Search Results</h1>
    <p v-if="query">You searched for: {{ query }}</p>
    <p v-else>Please enter a search query.</p>
  </div>
</template>

<script>
export default {
  name: 'SearchUser',
  // 这里存在一个query的props
  props: {
    query: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>
