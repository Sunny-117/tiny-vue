# Vue 插件开发与全局错误处理和日志记录插件实战

> 本文所有源码均在：https://github.com/Sunny-117/tiny-vue/tree/main/tutorial


# Vue 插件基础

插件（plugin）是一种可选的独立模块，它可以添加特定功能或特性，而无需修改主程序的代码。

## Vue中使用插件

```js
const app = createApp();
// 通过use方法来使用插件
app.use(router).use(pinia).use(ElementPlus).mount('#app')
```

## Vue中制作插件

1. 一个插件可以是一个**拥有 install 方法的对象**：

   ```js
   const myPlugin = {
     install(app, options) {
       // 配置此应用
     }
   }
   ```

2. 也可以直接是**一个安装函数本身**：

   ```js
   const install = function(app, options){}
   ```

   安装方法接收两个参数：

   1. app：应用实例

   2. options：额外选项，这是在使用插件时传入的额外信息

      ```js
      app.use(myPlugin, {
        /* 可选的选项，会传递给 options */
      })
      ```

# Vue中插件带来的增强

1. 通过 app.component 和 app.directive 注册一到多个全局组件或自定义指令
2. 通过 app.provide 使一个资源注入进整个应用
3. 向 app.config.globalProperties 中添加一些全局实例属性或方法
4. 一个可能上述三种都包含了的功能库 (例如 vue-router)

例如：自定义组件库时，install 方法所做的事情就是往当前应用注册所有的组件

```js
import Button from './Button.vue';
import Card from './Card.vue';
import Alert from './Alert.vue';

const components = [Button, Card, Alert];

const myPlugin = {
  install(app, options){
    // 这里要做的事情，其实就是引入所有的自定义组件
    // 然后将其注册到当前的应用里面
    components.forEach(com=>{
      app.component(com.name, com);
    })
  }
}

export default myPlugin;
```



# **实战案例**：全局错误处理和日志记录插件

在企业级应用开发中，经常需要一个 **全局错误处理和日志记录插件**，它能够帮助捕获和记录全局的错误信息，并提供一个集中化的日志记录机制。

我们的插件目标如下：

1. **捕获全局的 Vue 错误**和**未处理的 Promise 错误**。
2. 将错误信息**记录到控制台**或**发送到远程日志服务器**。
3. 提供一个 Vue 组件用于显示最近的错误日志。

## 1. 服务器开发

先准备一个服务器，用来收集和存储日志信息

```js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // 引入 cors 中间件
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// 使用 cors 中间件解决跨域问题
app.use(cors());

// 使用 body-parser 中间件解析 JSON 请求体
app.use(bodyParser.json());

// 日志记录的目录
const logDirectory = path.join(__dirname, "logs");

// 确保日志目录存在
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 处理日志记录的路由
app.post("/log", (req, res) => {
  const { error, stack, info, time } = req.body;

  // 创建日志条目
  const logEntry = `[${time}] ${info}: ${error}\n${stack}\n\n`;

  // 将日志写入文件
  const logFilePath = path.join(logDirectory, "error.log");
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Failed to write log:", err);
      return res.status(500).send("Failed to write log");
    }
    console.log("Log entry recorded");
    res.status(200).send("Log entry recorded");
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Logger server is running on http://localhost:${port}`);
});

```

## 2. 完成 Vue 插件基础结构搭建

```js
// error-logger.js
import ErrorLogger from './ErrorLogger.vue'

export default {
  install(app, options = {}) {
    // 1. 首先进行参数归一化

    // 设置一个默认的 options
    const defaultOptions = {
      logToConsole: true, // 是否把错误日志打印到控制台
      remotoLogging: false, // 是否把错误日志发送到服务器
      remoteUrl: '' // 远程日志服务器地址
    }

    // 合并用户传入的 options 和默认 options
    const config = { ...defaultOptions, ...options }

    // 2. 捕获两种类型的错误

    // （1）全局Vue错误
    app.config.errorHandler = (err, vm, info) => {
      logError(err, info)
    }

    // （2）捕获未处理的 Promise 错误
    window.addEventListener('unhandledrejection', (event) => {
      logError(event.reason, 'unhandled promise rejection error!!!')
    })

    // 3. 统一交给错误处理函数处理

    // 错误处理函数
    function logError(error, info) {
      // 是否在控制台输出
      if (config.logToConsole) {
        // 并且console.error方法是改写过的，会把error信息记录到errors数组里面
        console.error(`[错误：${info}]`, error)
      }

      // 是否发送到远程服务器
      if (config.remotoLogging && config.remoteUrl) {
        fetch(config.remoteUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            error: error.message, // 错误消息
            stack: error.stack, // 错误堆栈
            info, // 具体错误说明信息
            time: new Date().toISOString() // 记录时间
          })
        }).catch(console.error)
      }
    }

    // 4. 注册 ErrorLogger 组件
    app.component('ErrorLogger', ErrorLogger)
  }
}

```

```html
<!-- ErrorLogger.vue -->
<template>
  <div v-if="errors.length">
    <h1>错误日志</h1>
    <ul>
      <li v-for="error in errors" :key="error.time">{{ error.time }} - {{ error.message }}</li>
    </ul>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

// 该数组用于存储错误信息
const errors = reactive([])

onMounted(() => {
  // 改写 console.error 方法
  // 之后在使用 console.error 方法打印错误的时候
  // 会自动将错误信息推入到 errors 数组中
  const oldConsoleError = console.error
  console.error = (...args) => {
    // 将错误信息推入到 errors 数组中
    errors.push({
      message: args[0],
      time: new Date().toDateString()
    })
    oldConsoleError.apply(console, args)
  }
})
</script>

```

## 3. 使用此插件

```js
// 使用插件
app.use(ErrorLogger, {
  logToConsole: true,
  remotoLogging: true,
  remoteUrl: 'http://localhost:3000/log'
})
```

## 4. 触发错误动作

```html
<template>
  <div>
    <h1>错误插件使用示例</h1>
    <button @click="triggerError">触发错误</button>
    <!-- 使用由ErrorLogger插件所提供的组件 -->
    <ErrorLogger />
  </div>
</template>

<script setup>
function triggerError() {
  // 触发一个错误
  throw new Error('这是一个错误呀！！！')
}
</script>

```

点击触发错误的button后，可以发现服务器目录logs文件夹下多了error.log日志文件

```plain
[2024-08-27T06:20:46.234Z] native event handler: 这是一个错误呀！！！
Error: 这是一个错误呀！！！
    at triggerError (http://127.0.0.1:5173/src/App.vue:23:9)
    at callWithErrorHandling (http://127.0.0.1:5173/node_modules/.vite/deps/vue.js?v=5ad85592:1663:19)
    at callWithAsyncErrorHandling (http://127.0.0.1:5173/node_modules/.vite/deps/vue.js?v=5ad85592:1670:17)
    at HTMLButtonElement.invoker (http://127.0.0.1:5173/node_modules/.vite/deps/vue.js?v=5ad85592:10305:5)
```


# 「❤️ 感谢大家」

如果你觉得这篇内容对你挺有有帮助的话：
点赞支持下吧，让更多的人也能看到这篇内容（收藏不点赞，都是耍流氓 -\_-）欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。觉得不错的话，也可以阅读 Sunny 近期梳理的文章（感谢掘友的鼓励与支持 🌹🌹🌹）：

**我的博客：**

**Github：**[**https://github.com/sunny-117/**](https://github.com/sunny-117/)

**前端八股文题库：**[https://sunny-117.github.io/blog/](https://sunny-117.github.io/blog/)

**前端面试手写题库：**[https://github.com/Sunny-117/js-challenges](https://github.com/Sunny-117/js-challenges)

**手写前端库源码教程：**[https://sunny-117.github.io/mini-anything](https://sunny-117.github.io/mini-anything/)

**热门文章**

- [✨ 爆肝 10w 字，带你精通 React18 架构设计和源码实现【上】](https://juejin.cn/spost/7381371976035532835)
- [✨ 爆肝 10w 字，带你精通 React18 架构设计和源码实现【下】](https://juejin.cn/spost/7381395976676196387)
- [前端包管理进阶：通用函数库与组件库打包实战](https://juejin.cn/post/7376827589909266458)
- [🍻 前端服务监控原理与手写开源监控框架 SDK](https://juejin.cn/post/7374265502669160482)
- [🚀 2w 字带你精通前端脚手架开源工具开发](https://juejin.cn/post/7363607004348989479)
- [🔥 爆肝 5w 字，带你深入前端构建工具 Rollup 高阶使用、API、插件机制和开发](https://juejin.cn/post/7363607004348923943)
- [🚀 Rust 构建简易实时聊天系统](https://juejin.cn/post/7389952004792434688)

**专栏**

- [精通现代前端工具链及生态](https://juejin.cn/column/7287224080172302336)
- [esbuild 原理与应用实战](https://juejin.cn/column/7285233095058718756)
- [js-challanges 题解来了，迎接你的校招提前批](https://juejin.cn/column/7244788137410560055)
