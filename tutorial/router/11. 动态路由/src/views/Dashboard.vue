<template>
  <el-container>
    <!-- 管理系统头部 -->
    <el-header>
      <!-- 左侧logo -->
      <el-col :span="23">
        <img class="logo" src="../assets/logo.png" />
        <span class="sysTitle">智能云端学生平台</span>
      </el-col>
      <!-- 右侧用户头像 -->
      <el-col :span="1">
        <!-- 头像下拉菜单 -->
        <el-dropdown>
          <span class="el-dropdown-link">
            <span class="el-dropdown-link userinfo-inner">
              <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif" />
            </span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <span>用户信息</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="loginoutHandle">退出登陆</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-header>
    <el-container>
      <!-- 左侧导航栏 -->
      <el-aside width="200px" class="el-aside">
        <el-menu :default-active="activeIndex" @select="handleSelect">
          <!-- 不能像之前一样写死，而是应该动态根据数据来生成 -->
          <!-- <el-menu-item key="/student" index="/student">
            <el-icon><User /></el-icon>
            <span>学生模块</span>
          </el-menu-item>
          <el-menu-item key="/teacher" index="/teacher">
            <el-icon><Suitcase /></el-icon>
            <span>教师模块</span>
          </el-menu-item>
          <el-menu-item key="/teaching" index="/teaching">
            <el-icon><DataBoard /></el-icon>
            <span>教学模块</span>
          </el-menu-item>
          <el-menu-item key="/course" index="/course">
            <el-icon><Collection /></el-icon>
            <span>课程模块</span>
          </el-menu-item> -->

          <el-menu-item v-for="route in filteredRoutes" :key="route.path" :index="route.path">
            <el-icon><component :is="route.meta.icon" /></el-icon>
            <span>{{ route.meta.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 右侧内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 记录当前选中的菜单
const activeIndex = ref(localStorage.getItem('activeIndex') || '/')

const filteredRoutes = computed(() => {
  // 先获取到当前注册的路由
  const routes = router.getRoutes()
  // 过滤出所有带有 meta.title 的路由
  // 这里主要演示针对获取到的路由做一个二次处理
  return routes.filter((route) => route.meta && route.meta.title)
})

const handleSelect = (key) => {
  activeIndex.value = key
  // 更新本地的 activeIndex 的值
  localStorage.setItem('activeIndex', key)
  router.push(`${key}`) // 路由跳转
}

// 退出登录
const loginoutHandle = () => {
  // 1. 清空本地存储
  localStorage.clear()
  // 2. 跳转到登录页面
  router.replace('/login')
}
</script>

<style scoped>
.el-container {
  height: 100vh;
}

.el-header {
  background: rgb(53, 68, 87);
  color: #c0ccda;
  display: flex;
  line-height: 60px;
  font-size: 24px;
  padding: 0 30px 0 0;
}
.el-aside {
  background: rgb(53, 68, 87);
  color: #fff;
}
.logo {
  width: 40px;
  float: left;
  margin: 10px 15px;
}
.sysTitle {
  font-size: 20px;
  font-weight: 100;
}
.userinfo-inner {
  cursor: pointer;
}
.userinfo-inner img {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin: 10px 0px 10px 10px;
  float: right;
}
.el-aside {
  /* background: rgb(77, 94, 112); */
  color: #b3bcc5;
  line-height: 200px;
}

.el-main {
  background: #f1f2f7;
  color: #333;
  height: 100%;
  overflow: auto;
  padding-bottom: 100px;
}
.el-menu {
  background: rgb(53, 68, 87);
  border-right: none;
}
.el-menu-item {
  color: #c0c0c0;
}
.el-menu-item.is-active {
  /* color: #fff; */
  background-color: rgb(68, 88, 113);
}
.el-menu-item:hover {
  background-color: rgb(68, 88, 113);
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
