<template>
  <div class="loading">
    <div class="spinner"></div>
    Loading...
  </div>
</template>

<script setup></script>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  color: blue;
}

.spinner {
  border: 16px solid #f3f3f3;
  border-top: 16px solid blue;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
