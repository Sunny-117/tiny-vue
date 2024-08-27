<template>
  <div>
    <h2>我们的项目</h2>
    <p>这里是我们的一些项目</p>
    <ul>
      <li><RouterLink to="/about/projects/1">项目1</RouterLink></li>
      <li><RouterLink to="/about/projects/2">项目2</RouterLink></li>
      <li><RouterLink to="/about/projects/3">项目3</RouterLink></li>
    </ul>
    <router-view></router-view>
  </div>
</template>
