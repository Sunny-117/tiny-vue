<template>
  <div>
    <!-- 具有 read 权限的用户才能看到这个按钮 -->
    <button v-permission="['read']">读取按钮</button>
    <!-- 具有 write 权限的用户才能看到这个按钮 -->
    <button v-permission="['write']">写入按钮</button>
    <!-- 具有 admin 权限的用户才能看到这个按钮 -->
    <button v-permission="['admin']">管理权限</button>
  </div>
</template>

<script setup></script>

<style scoped></style>
