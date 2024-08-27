<template>
  <nav class="sidebar">
    <RouterLink to="/" activeClass="active" exactActiveClass="exact-active">首页</RouterLink>
    <RouterLink to="/about" activeClass="active" exactActiveClass="exact-active">关于</RouterLink>
    <RouterLink to="/about/team" activeClass="active" exactActiveClass="exact-active"
      >团队</RouterLink
    >
    <RouterLink to="/about/projects" activeClass="active" exactActiveClass="exact-active"
      >项目</RouterLink
    >
  </nav>
</template>

<style>
.sidebar {
  width: 200px;
  background-color: #f0f0f0;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar a {
  text-decoration: none;
  color: #333;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
}

.sidebar a.active {
  background-color: #df2c2c;
  color: white;
}

.sidebar a.exact-active {
  font-weight: bold;
  font-size: 26px;
  border: 2px solid #007bff;
}
</style>
