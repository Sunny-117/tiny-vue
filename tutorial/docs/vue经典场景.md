# Vue 封装树形组件、虚拟列表及其优化、懒加载

> 本文所有源码均在：https://github.com/Sunny-117/tiny-vue/tree/main/tutorial

# 封装树形组件

**效果**

支持的属性：

1. data：树形结果的数据，例如：

   ```js
   const data = ref([
     {
       label: '水果',
       checked: false, // 添加初始勾选状态
       children: [
         {
           label: '苹果',
           checked: false,
           children: [
             {
               label: '红富士',
               checked: false
             },
             {
               label: '黄元帅',
               checked: false
             }
           ]
         },
       ]
     },
   ])
   ```

2. show-checkbox：是否显示复选框

3. transition：是否应用过渡效果

4. 支持事件 @update:child-check，可以获取最新的状态

使用示例：

```html
<Tree
  :data="data"
  :show-checkbox="true"
  :transition="true"
  @update:child-check="handleChildCheck"
/>
```



关于复选框需要处理一些细节：

1. 父节点 选中/取消 会控制所有的子节点 选中/取消 状态
2. 子节点的 选中/取消 状态也会影响父节点


# 自定义ref实现防抖

首先是一个防抖最基本的实现：

```html
<template>
  <div class="container">
    <input @input="debounceInputHandler" type="text" />
    <p class="result">{{ text }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { debounce } from 'lodash'
const text = ref('')

function inputHandler(e) {
  text.value = e.target.value
}

const debounceInputHandler = debounce(inputHandler, 1000)
</script>

<style scoped>
.container {
  width: 80%;
  margin: 1em auto;
}
.result {
  color: #333;
}
.container input {
  width: 100%;
  height: 30px;
}
</style>
```

假设Vue给我们提供了一个防抖的ref：

```html
<template>
  <div class="container">
    <input v-model="text" type="text" />
    <p class="result">{{ text }}</p>
  </div>
</template>

<script setup>
import { debounceRef } from 'vue'
const text = debounceRef('', 1000)
</script>
```

上面的设想是美好的，代码能够简洁很多，但是 Vue 并没有给我们提供 debounceRef.

怎么办？？？自己实现

Vue内置API：customRef

Type

```js
function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T
  set: (value: T) => void
}
```

下面是 customRef 的一个基本使用示例：

```js
import { customRef } from 'vue'
let value = ''
const text = customRef(() => {
  return {
    get() {
      console.log('get')
      return value
    },
    set(val) {
      value = val
      console.log('set')
    }
  }
})
console.log(text)
console.log(text.value)
text.value = 'test'
```

官方文档：https://vuejs.org/api/reactivity-advanced.html#customref

通过 customRef 实现 ref 原有的功能：

```html
<template>
  <div class="container">
    <input v-model="text" type="text" />
    <p class="result">{{ text }}</p>
  </div>
</template>

<script setup>
import { customRef } from 'vue'
let value = '111'
const text = customRef((track, trigger) => {
  return {
    get() {
      track()
      console.log('get方法被调用')
      return value
    },
    set(val) {
      trigger()
      console.log('set方法被调用')
      value = val
    }
  }
})
</script>

<style scoped>
.container {
  width: 80%;
  margin: 1em auto;
}
.result {
  color: #333;
}
.container input {
  width: 100%;
  height: 30px;
}
</style>
```

下面是通过自定义ref来实现防抖：

```js
import { customRef } from 'vue'
import { debounce } from 'lodash'
export function debounceRef(value, delay = 1000) {
  return customRef((track, trigger) => {
    let _value = value

    const _debounce = debounce((val) => {
      _value = val
      trigger() // 派发更新
    }, delay)

    return {
      get() {
        track() // 收集依赖
        return _value
      },
      set(val) {
        _debounce(val)
      }
    }
  })
}
```

# 懒加载

**检查元素可见性**

IntersectionObserver 是一个**现代浏览器 API**，用于检测一个元素（或其子元素）相对于视口或某个祖先元素的可见性变化。

**基本用法**

```js
const ob = new IntersectionObserver(callback, options);
```

1. callback: **当被观察元素的可见性变化时调用的回调函数**，callback **一开始会触发一次，确认当前的可视状**态（无论当前是可见还是不可见），之后在每次可视状态发生改变时会触发。回调函数里面有两个参数：

   - entries: 一个数组，包含所有被观察元素的 IntersectionObserverEntry 对象，每个对象包含以下属性：
     - boundingClientRect: 被观察元素的矩形区域信息。
     - intersectionRatio: 被观察元素的可见部分与整个元素的比例。
     - intersectionRect: 可见部分的矩形区域信息。
     - isIntersecting: 布尔值，表示元素是否与根元素相交。
     - rootBounds: 根元素的矩形区域信息。
     - target: 被观察的目标元素。
     - time: 触发回调的时间戳。
   - observer: IntersectionObserver 实例本身。

2. options: 配置对象，用于**定制观察行为**

   - root：指定用作视口的元素。默认值为 null，表示使用浏览器视口作为根元素。

   - rootMargin: 类似于 CSS 的 margin 属性，**定义根元素的外边距**，用于扩展或缩小根元素的判定区域。可以用像素或百分比表示，例如 '10px' 或 '10%'。
   - threshold: 是一个 0～1 之间的值，表示一个触发的阈值，如果是 0，只要目标元素一碰到 root 元素，就会触发，如果是1，表示目标元素完全进入 root 元素范围，才会触发。设置观察元素进入到根元素的百分比。

有了 observer 实例对象后，要观察哪个元素，直接通过 observe 方法来进行观察即可，取消观察通过 unobserve 方法：

```js
// 开始观察
ob.observe(elementA);
ob.observe(elementB);

// 停止观察
io.unobserve(element);
```

示例：

```js
// 示例一

// // 先获取要观察的目标元素
// const target = document.querySelector(".target");

// // 当被观察的元素的可见性发生变化时，会调用回调函数
// const callback = (entries, observer) => {
//   console.log("回调函数触发了");
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       console.log("目标元素进入视口");
//     } else {
//       console.log("目标元素离开视口");
//     }
//   });
// };

// const ob = new IntersectionObserver(callback, {
//   root: null, // 默认将视口作为根元素
//   rootMargin: "0px", // 根元素的边距
//   threshold: 0, // 交叉比例
// });

// // 观察target元素
// ob.observe(target);

// 示例二

// 先获取要观察的目标元素
const target = document.querySelector(".target");

// 当被观察的元素的可见性发生变化时，会调用回调函数
const callback = (entries, observer) => {
  console.log("回调函数触发了");
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log("目标元素进入视口");
    } else {
      console.log("目标元素离开视口");
    }
  });
};

const ob = new IntersectionObserver(callback, {
  root: document.querySelector(".container"), // 将 container 元素作为根元素
  rootMargin: "-50px", // 根元素的边距
  threshold: 0, // 交叉比例
});

// 观察target元素
ob.observe(target);

```

**懒加载**

懒加载含义：当出现的时候再加载。

懒加载核心原理：img 元素在 src 属性有值时，才会去请求对应的图片地址，那么我们可以先给图片一张默认的占位图：

```html
<img src="占位图.png">
```

再设置一个自定义属性 data-src，对应的值为真实的图片地址：

```html
<img src="占位图.png" data-src="图片真实地址">
```

之后**判断当然这个 img 元素有没有进入可视区域**，如果进入了，就把 data-src 的值赋给 src，让真实的图片显示出来。这就是图片懒加载的基本原理。

不过这里对于判断 img 元素有没有进入可视区域，有着新旧两套方案。

1. 旧方案

早期的方案是监听页面的滚动：

```js
window.addEventListener("scroll", ()=>{})
```

当 img 标签的顶部到可视区域顶部的距离，小于可视区域高度的时候，我们就认为图片进入了可视区域，画张图表示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-24-074243.png" alt="image-20240724154242876" style="zoom:50%;" />

示例代码：

```js
window.addEventListener("scroll", () => {
  const img = document.querySelectorAll('img')
  img.forEach(img => {
    const rect = img.getBoundingClientRect();
    console.log("rect", rect);
    if (rect.top < document.body.clientHeight) {
      // 当前这张图片进入到可视区域
      // 做 src 的替换
      img.src = img.dataset.src
    }
  })
})
```

2. 新方案

使用 IntersectionObserver 来实现。

```js
let observer = new IntersectionObserver(
  (entries, observer) => {
    for(const entrie of entries){
      if(entrie.isIntersection){
        // 进入此分支，说明当前的图片和根元素产生了交叉
        const img = entrie.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    }
  },
  {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.5
  }
);
// 先拿到所有的图片元素
const imgs = document.querySelectorAll("img");
imgs.forEach((img) => {
  //观察所有的图片元素
  observer.observe(img);
});
```



**Vue相关库**

安装：

```bash
npm install --save vue3-observe-visibility
```

注册

```js
import { createApp } from 'vue';
import App from './App.vue';
// 引入该第三方库
import { ObserveVisibility } from 'vue3-observe-visibility';

const app = createApp(App);

// 将其注册成为一个全局的指令
app.directive('observe-visibility', ObserveVisibility);

app.mount('#app');
```

使用示例

```html
<template>
  <div>
    <h1>Vue Observe Visibility Example</h1>
    <div
      v-observe-visibility="{
        callback: visibilityChanged,
        intersection: {
          root: null,
          rootMargin: '0px',
          threshold: 0.5
        }
      }"
      class="observed-element"
    >
      观察这个元素的可见性
    </div>
  </div>
</template>

<script setup>
function visibilityChanged(isVisible) {
  console.log('元素可见性变化:', isVisible)
}
</script>

<style scoped>
.observed-element {
  height: 200px;
  margin-top: 1000px;
  background-color: lightcoral;
}
</style>
```



实战演练：基于该库实现懒加载



# 虚拟列表

> 面试题：一次性给你 10000 条数据，前端怎么渲染到页面上？

长列表常见的 3 种处理方式：

1. 懒加载
2. 时间分片
3. 虚拟列表



**懒加载**

懒加载的原理在于：只有视口内的内容会被加载，其他内容在用户滚动到视口时才会被加载。这可以显著减少初次加载的时间，提高页面响应速度。这样的好处在于：

1. 节省带宽
2. 提升用户体验

懒加载的缺点：懒加载只能应对数据不是太多的情况。如果列表项有几万甚至几十万项，最终会有对应数量的 DOM 存在于页面上，严重降低页面性能。



**时间分片**

时间分片的本质是通过 requestAnimationFrame，**由浏览器来决定回调函数的执行时机**。大量的数据会被分多次渲染，每次渲染对应一个片段。在每个片段中处理定量的数据后，会将主线程还给浏览器，从而实现快速呈现页面内容给用户。

时间分片的缺点：

1. 效率低
2. 不直观
3. 性能差



总结：无论是懒加载还是时间分片，最终都是将完整数量的列表项渲染出来，这在面对列表项非常非常多的时候，页面性能是比较低的。



**虚拟列表**

原理：设置一个可视区域，然后用户在滚动列表的时候，本质上是**动态修改可视区域里面的内容**。

例如，一开始渲染前面 5 个项目

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-01-082418.png" alt="image-20240701162418114" style="zoom:40%;" />

之后用户进行滚动，就会动态的修改可视区域里面的内容，如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-01-082813.png" alt="image-20240701162813149" style="zoom:50%;" />

也就是说，始终渲染的只有可视区的那 5 个项目，这样能够极大的保障页面性能。



实现：实现定高的虚拟列表，这里所指的定高是说列表项的每一项高度相同

涉及到的信息：

1. 可视区域起始数据索引(startIndex)
2. 可视区域结束数据索引(endIndex)
3. 可视区域的数据
4. 整个列表中的偏移位置 startOffset

如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-01-084455.png" alt="image-20240701164454859" style="zoom:50%;" />

接下来整个虚拟列表的设计如下：

```html
<div class="infinite-list-container">
  <!-- 该元素高度为总列表的高度，目的是为了形成滚动 -->
  <div class="infinite-list-phantom"></div>
  <!-- 该元素为可视区域，里面就是一个一个列表项 -->
  <div class="infinite-list">
    <!-- item-1 -->
    <!-- item-2 -->
    <!-- ...... -->
    <!-- item-n -->
  </div>
</div>
```

- infinite-list-container：可视区域的容器 
- infinite-list-phantom：容器内的占位，高度为总列表高度，用于形成滚动条 
- infinite-list：列表项的渲染区域

如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-01-085848.png" alt="image-20240701165847905" style="zoom:50%;" />

接下来监听 infinite-list-container 的 scroll 事件，获取滚动位置的 scrollTop，因为回头需要设置 list 向下位移的距离

- 假定可视区域高度固定，称之为 screenHeight
- 假定列表每项高度固定，称之为 itemSize
- 假定列表数据称之为 listData（就是很多的列表数据，几万项、几十万项列表数据）
- 假定当前滚动位置称之为 scrollTop

那么我们能够计算出这么一些信息：

1. 列表总高度 ：listHeight = listData.length * itemSize
2. 可显示的列表项数 : visibleCount = Math.ceil(screenHeight / itemSize)
3. 数据的起始索引: startIndex = Math.floor(scrollTop / itemSize)
4. 数据的结束索引: endIndex = startIndex + visibleCount
5. 列表显示数据为: visibleData = listData.slice(startIndex, endIndex)

当发生滚动后，由于渲染区域相对于可视区域发生了偏移，因此我们需要计算出这个偏移量，然后使用 transform 重新偏移回可视区域。

偏移量的计算：startOffset = scrollTop - (scrollTop % itemSize)

思考🤔：为什么要减去 scrollTop % itemSize ？

答案：之所以要减去 scrollTop % itemSize，是为了将 scrollTop 调整到一个与 itemSize 对齐的位置，避免显示不完整的列表项。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-01-090127.png" alt="image-20240701170126764" style="zoom:50%;" />

实战演练：实现定高的虚拟列表

定高的虚拟列表存在一些问题，或者说可以优化的地方：

1. 动态高度
2. 白屏现象
3. 滚动事件触发频率过高

# 虚拟列表优化

遗留问题：

- 动态高度
- 白屏问题
- 滚动事件触发频率过高

**动态高度**

在实际应用中，列表项目里面可能包含一些可变内容，导致列表项高度并不相同。例如新浪微博：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-02-004546.png" alt="image-20240702084546314" style="zoom:50%;" />

不固定的高度就会导致：

- 列表总高度：listHeight = listData.length * itemSize 
- 偏移量的计算：startOffset = scrollTop - (scrollTop % itemSize)
- 数据的起始索引 startIndex = Math.floor(scrollTop / itemSize) 

这些属性的计算不能再通过上面的方式来计算。因此我们会遇到这样的一些问题：

1. 如何获取真实高度？
2. 相关属性该如何计算？
3. 列表渲染的项目有何改变？

解决思路：

1. 如何获取真实高度？
   - 如果能获得列表项高度数组，真实高度问题就很好解决。但在实际渲染之前是**很难拿到每一项的真实高度**的，所以我们采用**预估一个高度**渲染出真实 DOM，再根据 DOM 的实际情况去更新真实高度。
   - 创建一个**缓存列表**，其中列表项字段为 索引、高度与定位，并**预估列表项高度**用于**初始化缓存列表**。在渲染后根据 DOM 实际情况**更新缓存列表**。

2. 相关的属性该如何计算？
   - 显然以前的计算方式都无法使用了，因为那都是针对固定值设计的。
   - 于是我们需要 **根据缓存列表重写计算属性、滚动回调函数**，例如列表总高度的计算可以使用缓存列表最后一项的定位字段的值。

3. 列表渲染的项目有何改变？
   - 因为用于渲染页面元素的数据是根据 **开始/结束索引** 在 **数据列表** 中筛选出来的，所以只要保证索引的正确计算，那么**渲染方式是无需变化**的。
   - 对于开始索引，我们将原先的计算公式改为：在 **缓存列表** 中搜索第一个底部定位大于 **列表垂直偏移量** 的项并返回它的索引
   - 对于结束索引，它是根据开始索引生成的，无需修改。



**白屏问题**

在第一版的实现中，我们仅渲染可视区域的元素。此时如果用户滚动过快，会出现白屏闪烁的现象。

之所以会有这个现象，是因为先加载出来的是白屏（没有渲染内容），然后迅速会被替换为表格内容，从而出现闪烁的现象。

并且这种现象在越低性能的浏览器上面表现得越明显。

解决思路：

为了让页面的滚动更加平滑，我们可以在原先列表结构的基础上加上**缓冲区**，也就是整个渲染区域由 **可视区 + 缓冲区** 共同组成，这样就给滚动回调和页面渲染留出了更多的时间。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-02-010153.png" alt="image-20240702090152620" style="zoom:50%;" />

这样设计后，缓冲区的数据会进入到可视区域，然后我们要做的就是更新缓冲区的数据。

代码片段：

```js
const aboveCount = computed(() => {
  // 缓冲区列表项个数的计算，其实就是可视区显示个数 * 缓冲比例
  // 但是考虑到可能存在当前虚拟列表处于最顶端，所以需要和 startIndex 做一个比较，取最小值
  return Math.min(startIndex.value, props.bufferScale * visibleCount.value)
})

const belowCount = computed(() => {
  return Math.min(props.listData.length - endIndex.value, props.bufferScale * visibleCount.value)
})
```

假设我们有如下场景：

- 总共有 100 项数据（props.listData.length = 100）
- 当前可视区域显示 10 项（visibleCount.value = 10）
- bufferScale 设置为 1
- 当前 startIndex.value = 20（表示当前可视区域从第21项开始显示）
- 当前 endIndex.value = 29（表示当前可视区域显示到第30项）

计算 aboveCount：

```js
const aboveCount = Math.min(20, 1 * 10)
// 计算结果为 Math.min(20, 10) = 10
```

计算 belowCount

```js
const belowCount = Math.min(100 - 30, 1 * 10)
// 计算结果为 Math.min(70, 10) = 10
```

因此最终上下的缓冲区的缓冲列表项目均为10.

另外关于整个列表的渲染，之前是根据索引来计算的，现在就需要额外加入上下缓冲区大小重新计算，如下所示：

```js
const visibleData = computed(() => {
  let startIdx = startIndex.value - aboveCount.value
  let endIdx = endIndex.value + belowCount.value
  return props.listData.slice(startIdx, endIdx)
})
```

最后，因为多出了缓冲区域，所以偏移量也要根据缓冲区来重新进行计算，如下所示：

```js
const setStartOffset = () => {
  let startOffset

  // 检查当前可视区域的第一个可见项索引是否大于等于1（即当前显示的内容不在列表最开始的地方）
  if (startIndex.value >= 1) {
    
    // 计算当前可视区域第一项的顶部位置与考虑上方缓冲区后的有效偏移量
    // positions[startIndex.value].top 是当前可视区域第一项的顶端位置
    // positions[startIndex.value - aboveCount.value].top 是考虑上方缓冲区后，开始位置的顶端位置
    // 如果上方缓冲区存在，则减去它的顶端位置；否则使用 0 作为初始偏移量
    let size =
      positions[startIndex.value].top -
      (positions[startIndex.value - aboveCount.value]
        ? positions[startIndex.value - aboveCount.value].top
        : 0)

    // 计算 startOffset：用当前可视区域第一个项的前一项的底部位置，减去上面计算出的 size，
    // 这个 size 表示的是在考虑缓冲区后需要额外平移的偏移量
    startOffset = positions[startIndex.value - 1].bottom - size
  } else {
    // 如果当前的 startIndex 为 0，表示列表显示从最开始的地方开始，没有偏移量
    startOffset = 0
  }

  // 设置内容容器的 transform 属性，使整个内容平移 startOffset 像素，以确保正确的项对齐在视口中
  content.value.style.transform = `translate3d(0,${startOffset}px,0)`
}
```

至于这个 startOffset 具体是怎么计算的，如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-08-17-072437.png" alt="image-20240817152436764" style="zoom:50%;" />

setStartOffset 方法重写完毕后，整个白屏闪烁问题也就完美解决了。



**滚动事件触发频率过高**

上一版实现中，我们绑定的是 scroll 滚动事件，虽然效果实现了，但是 scroll 事件的触发频率非常高，每次用户一滚动就会触发，而每次触发都会执行 scroll 回调方法。

解决思路：

可以使用 IntersectionObserver 来替换监听 scroll 事件。

相比 scroll，IntersectionObserver 可以设置多个阈值来检测元素进入视口的不同程度，只在必要时才进行计算，没有性能上的浪费。并且监听回调也是异步触发的。

****

# Websocket聊天室

**Socket.IO**

Socket.IO 是一个用于实现**实时双向通信**的库，通常用于构建需要实时交互的 web 应用程序。它**建立在 WebSocket 协议之上**，但比 WebSocket 提供了更高级的功能和更好的兼容性。

**主要特性**

1. 实时双向通信：支持客户端和服务器之间的实时消息交换。
2. 自动重连：连接断开后，Socket.IO 会自动尝试重新连接。
3. 事件驱动架构：使用事件的方式处理通信，支持自定义事件，使得开发更加直观和灵活。
4. 跨平台兼容性：即使在不支持 WebSocket 的环境中，Socket.IO 也能通过轮询等其他技术进行通信。
5. 命名空间（Namespaces）：允许通过命名空间将不同的通信逻辑隔离开来，便于管理和扩展。
6. 房间（Rooms）：可以将客户端分配到特定的房间，便于进行组播、广播等操作。

**使用场景**

- 即时通讯应用：如聊天软件、客服系统。
- 协同编辑：实时同步文档或表格的编辑状态。
- 多人在线游戏：同步游戏状态和玩家动作。
- 实时数据更新：如股票、天气等实时信息推送。
- 实时通知和警报系统。



服务端：Node.js + Express

客户端：Vue3 + Vite



笔记

客户端需要安装 sokcet.io-client 这个库，安装完成后需要在 main.js 注册使用这个库

```js
// main.js

// 创建一个 socket 客户端实例
const socket = io('http://localhost:3000', {
  // 这里是在配置客户端与服务器端建立连接的优先级列表
  // 1. 第一优先级使用 websocket
  // 2. 第二优先级使用 polling（长轮询）
  // 3. 第三优先级使用 flashsocket
  transports: ['websocket', 'polling', 'flashsocket']
})

// 将 socket 实例挂载到 app.config.globalProperties 上
app.config.globalProperties.$socket = socket
```
