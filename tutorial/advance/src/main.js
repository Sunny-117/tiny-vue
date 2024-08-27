// // import './assets/main.css'

// import { createApp } from 'vue'
// import App from './透传/App.vue'

// createApp(App).mount('#app')

// import './assets/main.css'

// import { createApp, reactive } from 'vue'
// import App from './依赖注入/App.vue'

// // 创建全局配置信息对象
// const globalConfig = reactive({
//   themeColor: 'blue',
//   user: {
//     name: '张三',
//     role: 'admin'
//   }
// })

// // 更新主题颜色的方法
// function changeThemeColor(color) {
//   globalConfig.themeColor = color
// }

// const app = createApp(App)

// app.provide('globalConfig', globalConfig)
// app.provide('changeThemeColor', changeThemeColor)

// app.mount('#app')



// import { createApp } from 'vue'
// import App from './组合式函数/App.vue'

// const app = createApp(App)

// app.mount('#app')


// import './assets/main.css'

// import { createApp } from 'vue'
// import App from './自定义指令/App2.vue'

// // 模拟用户权限
// const userPermissions = ['admin', 'read']

// const app = createApp(App)

// app.directive('permission', {
//   mounted(el, binding) {
//     const { value } = binding
//     if (value && value instanceof Array) {
//       // 检查用户权限是否包含指令传入的权限
//       const hasPermission = value.some((item) => userPermissions.includes(item))
//       if (!hasPermission) {
//         el.style.display = 'none'
//       }
//     } else {
//       throw new Error('请传入一个权限数组')
//     }
//   }
// })


// // 接下来需要对时间戳进行一个转换
// const time = {
//   // 获取当前时间戳
//   getUnix() {
//     const date = new Date()
//     return date.getTime()
//   },
//   // 获取今天0时0分0秒的时间戳
//   getTodayUnix() {
//     const date = new Date()
//     date.setHours(0)
//     date.setMinutes(0)
//     date.setSeconds(0)
//     date.setMilliseconds(0)
//     return date.getTime()
//   },
//   // 获取今年 1 月 1 日 0 点 0 分 0 秒的时间戳
//   getYearUnix: function () {
//     var date = new Date()
//     date.setMonth(0)
//     date.setDate(1)
//     date.setHours(0)
//     date.setMinutes(0)
//     date.setSeconds(0)
//     date.setMilliseconds(0)
//     return date.getTime()
//   },
//   // 获取标准年月日
//   getLastDate: function (time) {
//     var date = new Date(time)
//     var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
//     var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
//     return date.getFullYear() + '-' + month + '-' + day
//   },
//   // 转换时间
//   getFormatTime(timestamp) {
//     // 根据时间戳来决定返回的提示信息
//     var now = this.getUnix()
//     var today = this.getTodayUnix()
//     var timer = (now - timestamp) / 1000
//     var tip = ''

//     if (timer <= 0) {
//       tip = '刚刚'
//     } else if (Math.floor(timer / 60) <= 0) {
//       tip = '刚刚'
//     } else if (timer < 3600) {
//       tip = Math.floor(timer / 60) + '分钟前'
//     } else if (timer >= 3600 && timestamp - today >= 0) {
//       tip = Math.floor(timer / 3600) + '小时前'
//     } else if (timer / 86400 <= 31) {
//       tip = Math.ceil(timer / 86400) + '天前'
//     } else {
//       tip = this.getLastDate(timestamp)
//     }
//     return tip
//   }
// }

// app.directive('time', {
//   mounted(el, binding) {
//     // 拿到时间戳
//     const { value } = binding
//     el.innerHTML = time.getFormatTime(value)
//     // 并且创建一个计时器，实时的更新提示信息
//     el.timeout = setInterval(() => {
//       el.innerHTML = time.getFormatTime(value)
//     }, 60000)
//   },
//   unmounted(el) {
//     clearInterval(el.timeout)
//     delete el.timeout
//   }
// })
// app.mount('#app')


import { createApp } from 'vue'
import App from './Suspense事件/App.vue'

const app = createApp(App)

app.mount('#app')
