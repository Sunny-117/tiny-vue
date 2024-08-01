# 从数据劫持到Vue3响应式系统的源码实现

> 本文所有源码均在：https://github.com/Sunny-117/tiny-vue/tree/main/tutorial

## 数据拦截的本质

### 数据拦截的方式

**什么是拦截？**

你想像一下你在路上开着车，从地点 A 前往地点 B. 本来能够一路畅通无阻，顺顺利利的到达地点 B，但是因为你路上不小心违反了交规，例如不小心开着远光灯一路前行，此时就会被警察拦截下来，对你进行批评教育加罚款。（满满的血泪史😢）

这就是现实生活中的拦截，**在你做一件事情的中途将你打断，从而能够做一些额外的事情**。

**数据拦截**

所谓数据拦截，无外乎就是你在对数据进行操作，例如读数据、写数据的时候

```js
const obj = {name : "张三"};
obj.name; // 正常读数据，直接就读了
obj.name = "李四"; // 正常写数据，直接就写了
obj.age = 18;
```

我们需要**一种机制，在读写操作的中途进行一个打断，从而方便做一些额外的事情**。这种机制我们就称之为数据拦截。

这种拦截打断的场景其实有很多，比如 Vue 或者 React 里面的生命周期钩子方法，这种钩子方法本质上也是一种拦截，在组件从初始化到正常渲染的时间线里，设置了几个拦截点，从而方便开发者做一些额外的事情。

**JS中的数据拦截**

接下来我们来看一下 JS 中能够实现数据拦截的方式有哪些？

目前来讲，主要的方式有两种：

1. Object.defineProperty：对应  Vue1.x、2.x 响应式
2. Proxy：对应 Vue3.x 响应式

简单复习一下这两个 API.

1. Object.defineProperty

这是 Object 上面的一个静态方法，用于**给一个对象添加新的属性**，除此之外**还能够对该属性进行更为详细的配置**。

```js
Object.defineProperty(obj, prop, descriptor)
```

- obj ：要定义属性的对象
- prop：一个字符串或 [`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)，指定了要定义或修改的属性键。
- descriptor：属性描述符。

重点其实是在属性描述符，这个参数是一个对象，可以描述的信息有：

- value 设置属性值，默认值为 undefined.
- writable 设置属性值是否可写，默认值为 false.
- enumerable 设置属性是否可枚举，默认为 false.
- configurable 是否可以配置该属性，默认值为 false.  这里的配置主要是针对这么一些点：
  - 该属性的类型是否能在数据属性和访问器属性之间更改
  - 该属性是否能删除
  - 描述符的其他属性是否能被更改
- get 取值函数，默认为 undefined.
- set 存值函数，默认为 undefined

数据属性：value、writable

访问器属性：getter、setter

数据属性和访问器属性默认是互斥。

也就是说，默认情况下，使用 Object.defineProperty( ) 添加的属性是不可写、不可枚举和不可配置的。

```js
function Student() {
  let stuName = "张三";
  Object.defineProperty(this, "name", {
    get() {
      return stuName;
    },
    set(value) {
      if (!isNaN(value)) {
        stuName = "张三";
      } else {
        stuName = value;
      }
    },
  });
}
const stu = new Student();
console.log(stu.name);
stu.name = "李四";
console.log(stu.name);
stu.name = 100;
console.log(stu.name);
```

2. Proxy

另外一种方式是使用 Proxy. 这是 ES6 新提供的一个 API，通过**创建代理对象的方式来实现拦截**。

```js
const p = new Proxy(target, handler)
```

- target : 目标对象，可以是任何类型的对象，包括数组，函数。
- handler: 定义代理对象的行为。
- 返回值：返回的就是一个代理对象，之后外部对属性的读写都是针对代理对象来做的

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-03-27-071734.png" alt="image-20240327151733943" style="zoom:50%;" />

```js
function Student() {
  const obj = {
    name: "张三",
  };
  return new Proxy(obj, {
    get(obj, prop) {
      return obj[prop] + "是个好学生";
    },
    set(obj, prop, value) {
      if (!isNaN(value)) {
        obj[prop] = "张三";
      } else {
        obj[prop] = value;
      }
    },
  });
}
const stu = new Student(); // stu 拿到的就是代理对象
console.log(stu.name); // 张三是个好学生
stu.name = "李四";
console.log(stu.name); // 李四是个好学生
stu.name = 100;
console.log(stu.name); // 张三是个好学生
```

### 两者共同点

**1. 都可以针对对象成员拦截**

无论使用哪一种方式，都能拦截读取操作

```js
const obj = {};
let _data = "这是一些数据";
Object.defineProperty(obj, "data", {
  get() {
    console.log("读取data的操作被拦截了");
    return _data;
  },
});
console.log(obj.data);
```

```js
const obj = {
  data: "这是一些数据",
  name: "张三"
};
const p = new Proxy(obj, {
  get(obj, prop) {
    console.log(`${prop}的读取操作被拦截了`);
    return obj[prop];
  },
});
console.log(p.data);
console.log(p.name);
```

两者都可以拦截写入操作：

```js
const obj = {};
let _data = "这是一些数据";
Object.defineProperty(obj, "data", {
  get() {
    console.log("读取data的操作被拦截了");
    return _data;
  },
  set(value){
    console.log("设置data的操作被拦截了");
    _data = value;
  }
});
obj.data = "这是新的数据";
console.log(obj.data);
```

```js
const obj = {
  data: "这是一些数据",
  name: "张三"
};
const p = new Proxy(obj, {
  get(obj, prop) {
    console.log(`${prop}的读取操作被拦截了`);
    return obj[prop];
  },
  set(obj, prop, value) {
    // 前面相当于是拦截下这个操作后，我们要做的额外的操作
    console.log(`${prop}的设置操作被拦截了`);
    // 后面就是真实的操作
    obj[prop] = value;
  }
});
p.data = "这是新的数据";
p.name = "李四";
```

**2. 都可以实现深度拦截**

两者在实现深度拦截的时候，需要自己书写递归来实现，但是总而言之是能够实现深度拦截的。

```js
const data = {
  level1: {
    level2: {
      value: 100,
    },
  },
};

function deepDefineProperty(obj) {
  for (let key in obj) {
    // 首先判断是否是自身属性以及是否为对象
    if (obj.hasOwnProperty(key) && typeof obj[key] === "object") {
      // 递归处理
      deepDefineProperty(obj[key]);
    }
    // 缓存一下属性值
    let _value = obj[key];
    Object.defineProperty(obj, key, {
      get() {
        console.log(`读取${key}属性`);
        return _value;
      },
      set(value) {
        console.log(`设置${key}属性`);
        _value = value;
      },
      configurable: true,
      enumerable: true,
    });
  }
}
deepDefineProperty(data);
console.log(data.level1.level2.value);
console.log("----------------");
data.level1.level2.value = 200;
```

```js
function deepProxy(obj) {
  return new Proxy(obj, {
    get(obj, prop) {
      console.log(`读取了${prop}属性`);
      if (typeof obj[prop] === "object") {
        // 递归的再次进行代理
        return deepProxy(obj[prop]);
      }
      return obj[prop];
    },
    set(obj, prop, value) {
      console.log(`设置了${prop}属性`);
      if (typeof value === "object") {
        return deepProxy(value);
      }
      obj[prop] = value;
    },
  });
}
const proxyData = deepProxy(data);
console.log(proxyData.level1.level2.value);
console.log("----------------");
proxyData.level1.level2.value = 200;
```

### 两者差异点

**1. 拦截的广度**

Vue3 的响应式，从原本的 Object.defineProperty 替换为了 Proxy. 

之所以替换，就是因为**两者在进行拦截的时候，无论是拦截的目标还是能够拦截的行为，都是不同的**：

- Object.defineProperty 是**针对对象特定属性**的**读写操作**进行拦截
- Proxy 则是**针对一整个对象**的**多种操作**，包括**属性的读取、赋值、属性的删除、属性描述符的获取和设置、原型的查看、函数调用等行为**能够进行拦截。

如果是使用 Object.defineProperty ，一旦后期给对象新增属性，是无法拦截到的，因为 Object.defineProperty 在设置拦截的时候是针对的特定属性，所以新增的属性无法被拦截。

但是 Proxy 就不一样，它是针对整个对象，后期哪怕新增属性也能够被拦截到。

另外，相比 Object.defineProperty，Proxy 能够拦截的行为也更多

```js
function deepProxy(obj) {
  return new Proxy(obj, {
    get(obj, prop) {
      console.log(`读取了${prop}属性`);
      if (typeof obj[prop] === "object") {
        // 递归的再次进行代理
        return deepProxy(obj[prop]);
      }
      return obj[prop];
    },
    set(obj, prop, value) {
      console.log(`设置了${prop}属性`);
      if (typeof value === "object") {
        return deepProxy(value);
      }
      obj[prop] = value;
    },
    deleteProperty(obj, prop) {
      console.log(`删除了${prop}属性`);
      delete obj[prop];
    },
    getPrototypeOf(obj) {
      console.log("拦截获取原型");
      return Object.getPrototypeOf(obj);
    },
    setPrototypeOf(obj, proto) {
      console.log("拦截设置原型");
      return Object.setPrototypeOf(obj, proto);
    },
  });
}
```

理解了上面的差异点之后，你就能够完全理解 Vue2 的响应式会有什么样的缺陷：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-17-025746.png" alt="image-20240517105745592" style="zoom:50%;" />



**2. 性能上的区别**

接下来是性能方面的区别，究竟哪种方式的性能更高呢？

**大多数情况下，Proxy 是高效的**，但是不能完全断定 Proxy 就一定比 Object.defineProperty 效率高，因为这还是得看具体的场景。

如果你**需要拦截的操作类型较少，且主要集中在某些特定属性上，那么 Object.defineProperty 可能提供更好的性能**。

- 但是只针对某个特定属性的拦截场景较少，一般都是需要针对一个对象的所有属性进行拦截
- 此时如果需要拦截的对象结构复杂（如需要递归到嵌套对象）或者需要拦截的操作种类繁多，那么使用这种方式就会变得复杂且效率低下。

如果你需要全面地拦截对象的各种操作，那么 Proxy 能提供更强大和灵活的拦截能力，尽管可能有一些轻微的性能开销。


## 响应式数据的本质

什么是响应式数据？其实就是**被拦截的对象**。

当对象被拦截后，针对对象的各种操作也就能够被拦截下来，从而让我们有机会做一些额外的事情。因此只要是被拦截了对象，就可以看作是一个响应式数据。

在 Vue3 中，创建响应式数据的方式，有 **ref** 和 **reactive** 两种，**这两个 API 的背后，就是就是针对对象添加拦截**。

在 JS 中，要实现数据拦截，要么是 Object.defineProperty，要么是 Proxy，而这两者都是针对**对象**来进行操作的。

ref 以及 reactive 源码：

```js
class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(
    value: T,
    public readonly __v_isShallow: boolean,
  ) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    // 有可能是原始值，有可能是 reactive 返回的 proxy
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    // 收集依赖 略
    return this._value
  }

  set value(newVal) {
    // 略
  }
}

// 判断是否是对象，是对象就用 reactive 来处理，否则返回原始值
export const toReactive = <T extends unknown>(value: T): T =>
  isObject(value) ? reactive(value) : value

// 回忆 ref 的用法
const state = ref(5);
state.value;
```

```js
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>,
) {
  // ...
    
  // 创建 Proxy 代理对象
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers,
  )
  proxyMap.set(target, proxy)
  return proxy
}

export function reactive(target: object) {
  // ...
  
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap,
  )
}
```

从源码中我们就可以看出，**ref 和 reactive 在实现响应式上面的策略是有所不同**：

- ref：使用 Object.defineProperty + Proxy 方式
- reactive：使用 Proxy 方式

这节课还有一个非常重要的知识点，就是要 **学会判断某个操作是否会产生拦截**。因为只有产生拦截，才会有后续的依赖收集和派发更新一类的操作。

简单复习上节课的知识，有两个 API 能够实现拦截：

1. Object.defineProperty
   - 特定的属性的读取
   - 特定的属性的赋值
2. 操作 Proxy 代理对象的成员
   - 读取
   - 赋值
   - 新增
   - 删除

测试题目：

```js
// demo1
let state = ref(1);
state; // 不会拦截
console.log(state); // 不会拦截
console.log(state.value); // 会拦截，因为访问了 value 属性
console.log(state.a); // 不会拦截
state.a = 3; // 不会拦截
state.value = 3; // 会拦截
delete state.value; // 不会拦截
state = 3; // 不会拦截
```

```js
// demo2
let state = ref({ a: 1 });
state; // 不会拦截
console.log(state); // 不会拦截
console.log(state.value); // 会拦截
console.log(state.a); // 不会拦截
console.log(state.value.a); // 会拦截，拦截到 value 和 a 属性的 get 操作
state.a = 3; // 不会拦截
state.value.a = 3; // 会拦截，value 的 get 操作，a 属性的 set 操作
delete state.value.a; // 会拦截，value 的 get 操作，a 属性的 delete 操作
state.value = 3; // 会拦截，value 的 set 操作
delete state.value; // 不会拦截
state = 3; // 不会拦截
```

```js
// demo3
let state = reactive({});
state; // 不会拦截
console.log(state); // 不会拦截
console.log(state.a); // 会拦截
state.a = 3; // 会拦截
state.a = {
  b: {
    c: 3,
  },
}; // 会拦截，拦截到 a 属性的 set 操作
console.log("-------------");
console.log(state.a.b.c); // 会拦截
delete state.a.b; // 会拦截 a 是 get 操作，b 是 delete 操作
```

```js
// demo4
const state = ref({ a: 1 });
const k = state.value; 
console.log("-------------");
console.log(k); // 不会拦截，k 相当于是一个 proxy 对象，没有针对成员进行操作
k.a = 3; // 会拦截，因为 k 是一个 proxy 对象，对 k 的成员进行操作会触发代理的 set 操作
const n = k.a; // 会拦截，因为访问了 k 的成员 a，会触发代理的 get 操作
console.log("-------------");
console.log(n); 
```

```js
// demo5
const arr = reactive([1, 2, 3]);
arr; // 不会拦截
arr.length; // 会拦截
arr[0]; // 会拦截，拦截 0 的 get 操作
arr[0] = 3; // 会拦截，拦截 0 的 set 操作
arr.push(4); // 会被拦截
```

再次强调，**一定要学会去判断针对一个对象进行操作的时候，是否会发生拦截，这一点非常重要**‼️



## 响应式的本质

- 依赖收集：所谓依赖收集，其实就是收集的一些函数。因为当数据发生变化的时候，需要重新执行这些函数，因此需要提前收集起来。
- 派发更新：所谓派发更新，就是通知被收集了的函数，现在数据已经更新了，你们需要重新执行一遍。

**数据**

当数据发生变换会通知一些函数重新执行，这里的数据指的就是**响应式数据**。

在 Vue 里面，那就是指：

- ref
- reactive
- props
- computed

这几种方式所得到的数据就是响应式数据。



**依赖**

谁和谁之间有依赖关系？

**响应式数据**和**函数**之间有依赖关系。**当函数在运行期间用到了响应式数据，那么我们可以称之为两者之间有依赖**。

但还有一点需要明确，那就是什么是用到？

**所谓用到，是指函数在运行期间出现了读取成员被拦截的情况，这样才算是用到**。

完整表述：**函数在运行期间，出现了读取响应式数据被拦截的情况，我们就称之为两者之间产生了依赖，这个依赖（也就是一个对应关系）是会被收集的，方便响应式数据发生变化时重新执行对应的函数**。

练习：

```js
// demo1
var a;
function foo() {
  console.log(a);
}
// 没有依赖关系，a 不是响应式数据
```

```js
// demo2
var a = ref(1);
function foo() {
  console.log(a);
}
// 没有依赖关系，虽然用到了响应式数据，但是没有出现读取拦截的情况
```

```js
// demo3
var a = ref(1);
function foo() {
  console.log(a.value);
}
// 有依赖关系，foo 依赖 value 属性
```

```js
// demo4
var a = ref({ b: 1 });
const k = a.value;
const n = k.b;
function foo() {
  a;
  a.value;
  k.b;
  n;
}
// 有依赖关系
// foo 依赖 a 的 value 属性
// foo 依赖 k 的 b 属性
```

```js
// demo5
var a = ref({ b: 1 });
const k = a.value;
const n = k.b;
function foo() {
  a;
  k.b;
  n;
}
// 有依赖关系
// foo 依赖 k 的 b 属性
```

```js
// demo6
var a = ref({ b: 1 });
const k = a.value;
const n = k.b;
function foo() {
  a;
  a.value.b
  n;
}
// 有依赖关系
// foo 依赖 a 的 value 以及 b 属性
```

```js
// demo7
var a = ref({ b: 1 });
const k = a.value;
const n = k.b;
function foo() {
  function fn2(){
    a;
    a.value.b
    n;
  }
  fn2();
}
// 有依赖关系
// foo 依赖 a 的 value 以及 b 属性
```

总而言之：**只需要判断在函数的运行期间，是否存在读取操作行为的拦截，只要存在这种类型的拦截，那么该函数就和该响应式数据存在依赖关系**。

不过，有一种情况需要注意，那就是**异步**。**如果在函数的运行期间存在异步代码，那么之后的代码统统不看了**。

```js
// demo8
var a = ref({ b: 1 });
const k = a.value;
const n = k.b;
async function foo() {
  a;
  a.value; // 产生依赖，依赖 value 属性
  await 1;
  k.b; // 没有依赖，因为它是异步后面的代码
  n;
}
```



**函数**

**函数必须是被监控的函数**。

- effect：这是 Vue3 源码内部的底层实现，后期会介绍
- watchEffect
- watch
- 组件渲染函数

因此最后总结一下：**<u>只有被监控的函数，在它的同步代码运行期间，读取操作被拦截的响应式数据，才会建立依赖关系，建立了依赖关系之后，响应式数据发生变化，对应的函数才会重新执行</u>**。

练习：

```js
// demo1
import { ref, watchEffect } from "vue";
const state = ref({ a: 1 });
const k = state.value;
const n = k.a;
watchEffect(() => {
  // 首先判断依赖关系
  console.log("运行");
  state; // 没有依赖关系产生
  state.value; // 会产生依赖关系，依赖 value 属性
  state.value.a; // 会产生依赖关系，依赖 value 和 a 属性
  n; // 没有依赖关系
});
setTimeout(() => {
  state.value = { a: 3 }; // 要重新运行
}, 500);

```

```js
// demo2
import { ref, watchEffect } from "vue";
const state = ref({ a: 1 });
const k = state.value;
const n = k.a;
watchEffect(() => {
  console.log("运行");
  state;
  state.value; // value
  state.value.a; // value a
  n;
});
setTimeout(() => {
  //   state.value; // 不会重新运行
  state.value.a = 1; // 不会重新运行
}, 500);
```

```js
// demo3
import { ref, watchEffect } from "vue";
const state = ref({ a: 1 });
const k = state.value;
const n = k.a;
watchEffect(() => {
  console.log("运行");
  state;
  state.value; // value
  state.value.a; // value、a
  n;
});
setTimeout(() => {
  k.a = 2; // 这里相当于是操作了 proxy 对象的成员 a
  // 要重新运行
  // 如果将上面的 state.value.a; 这句话注释点，就不会重新运行
}, 500);
```

```js
// demo4
import { ref, watchEffect } from "vue";
const state = ref({ a: 1 });
const k = state.value;
let n = k.a;
watchEffect(() => {
  console.log("运行");
  state;
  state.value;
  state.value.a;
  n;
});
setTimeout(() => {
  n++; // 不会重新运行
}, 500);
```

```js
// demo5
import { ref, watchEffect } from "vue";
const state = ref({ a: 1 });
const k = state.value;
let n = k.a;
watchEffect(() => {
  console.log("运行");
  state;
  state.value;
  state.value.a;
  n;
});
setTimeout(() => {
  state.value.a = 100; // 要重新运行
}, 500);
```

```js
// demo6
import { ref, watchEffect } from "vue";
let state = ref({ a: 1 });
const k = state.value;
let n = k.a;
watchEffect(() => {
  console.log("运行");
  state;
  state.value;
  state.value.a;
  n;
});
setTimeout(() => {
  state = 100; // 不要重新运行
}, 500);
```

```js
// demo7
import { ref, watchEffect } from "vue";
const state = ref({ a: 1 });
const k = state.value;
const n = k.a;
watchEffect(() => {
  console.log("运行");
  state;
  state.value; // value 会被收集
  n;
});
setTimeout(() => {
  state.value.a = 100; // 不会重新执行
}, 500);
```

```js
// demo8
import { ref, watchEffect } from "vue";
let state = ref({ a: 1 });
const k = state.value;
const n = k.a;
watchEffect(() => {
  console.log("运行");
  state.value.a; // value、a
});
setTimeout(() => {
  state.value = { a: 1 }; // 要重新运行
}, 500);
```

```js
// demo9
import { ref, watchEffect } from "vue";
const state = ref({ a: 1 });
const k = state.value;
const n = k.a;
watchEffect(() => {
  console.log("运行");
  state.value.a = 2; // 注意这里的依赖仅仅只有 value 属性
});
setTimeout(() => {
  //   state.value.a = 100; // 不会重新运行的
  state.value = {}; // 要重新运行
}, 500);
```

```js
// demo10
import { ref, watchEffect } from "vue";
let state = ref({ a: 1 });
const k = state.value;
const n = k.a;
watchEffect(() => {
  console.log("运行");
  state;
  state.value.a; // value、a
  n;
});
setTimeout(() => {
  state.value.a = 2; // 要重新运行
}, 500);
setTimeout(() => {
  //   k.a = 3; // 要重新运行
  k.a = 2; // 因为值没有改变，所以不会重新运行
}, 1000);
```

```js
// demo11
import { ref, watchEffect } from "vue";
let state = ref({ a: 1 });
const k = state.value;
const n = k.a;
watchEffect(() => {
  console.log("运行");
  state.value.a; // value、a
});
setTimeout(() => {
  state.value = { a: 1 }; // 要重新运行
}, 500);
setTimeout(() => {
  k.a = 3; // 这里不会重新运行，因为前面修改了 state.value，不再是同一个代理对象
}, 1000);
```

```js
// demo12
import { ref, watchEffect } from "vue";
let state = ref({ a: 1 });
const k = state.value;
const n = k.a;
watchEffect(() => {
  console.log("运行");
  state.value.a; // value、a
});
setTimeout(() => {
  state.value = { a: 1 }; // 要重新执行
}, 500);
setTimeout(() => {
  state.value.a = 2; // 要重新执行
}, 1000);
```

```js
// demo13
import { ref, watchEffect } from "vue";
let state = ref({ a: 1 });
const k = state.value;
const n = k.a;
watchEffect(() => {
  console.log("运行");
  state.value.a; // value、a
});
setTimeout(() => {
  state.value = { a: 1 }; // 重新执行
}, 500);
setTimeout(() => {
  state.value.a = 1; // 不会重新执行，因为值没有变化
}, 1500);

```

```js
// demo14
import { ref, watchEffect } from "vue";
let state = ref({ a: 1 });
const k = state.value;
const n = k.a;
watchEffect(() => {
  console.log("运行");
  state.value.a; // value、a
  k.a; // 返回的 proxy 对象的 a 成员
});
setTimeout(() => {
  state.value = { a: 1 }; // 要重新运行
}, 500);
setTimeout(() => {
  k.a = 3; // 会重新执行
}, 1000);
setTimeout(() => {
  state.value.a = 4; // 会重新执行
}, 1500);
```

在这节课的最后，我们再对响应式的本质做一个完整的总结：

**<u>所谓响应式，背后其实就是函数和数据的一组映射，当数据发生变化，会将该数据对应的所有函数全部执行一遍。当然这里的数据和函数都是有要求的。数据是响应式数据，函数是被监控的函数。</u>**

**<u>收集数据和函数的映射关系在 Vue 中被称之为依赖收集，数据变化通知映射的函数重新执行被称之为派发更新。</u>**

什么时候会产生依赖收集？

**<u>只有被监控的函数，在它的同步代码运行期间，读取操作被拦截的响应式数据，才会建立依赖关系，建立了依赖关系之后，响应式数据发生变化，对应的函数才会重新执行</u>**。



## 响应式和组件渲染

回顾一下之前讲的内容：

- 模板的本质：对应的就是 render 渲染**函数**，该函数执行之后，会返回虚拟 DOM，这是一种用来描述真实 DOM 的数据结构。
- 响应式的本质：当数据发生变化的时候，依赖该数据的**函数**重新运行。

假设 render 函数运行期间用到了响应式数据会怎么样？

结果很简单，那就是这个 render 函数会和响应式数据关联起来，当响应式数据发生变化的时候，所关联的 render 函数会重新运行，从而得到新的虚拟 DOM 结构，然后渲染器会根据新的虚拟 DOM 结构去更新真实 DOM 结构，从而在视觉感官上看到的是界面的变化。

>这里说是重新运行 render，其实都还不是最准确的表达，实际上源码内部是和 updateComponent 方法进行的关联，而该方法的内部调用了 render 函数。

**再看模板编译**

App.vue

```vue
<template>
  <div>{{ name }}</div>
  <div>{{ age }}</div>
</template>

<script setup>
import { ref } from 'vue'
let name = ref('Bill')
let age = ref(18)
</script>
```

在上面的代码中，模板用到了两个响应式数据，在模板中使用 ref 是会自动解包 value 的，因此这里就相当于在读取 vlaue 值，读取 value 就会产生读取的拦截，然后这两个响应式数据就会被模板背后所对应的渲染函数关联起来，有了依赖关系。

有了依赖关系之后，响应式数据的变化就会导致渲染函数（被监控的函数）重新执行，得到新的虚拟 DOM，从而 UI 得到更新。

下面是通过 vite-plugin-inspect 插件进行编译分析，从而验证上面的说法：

![image-20240524095001844](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-24-015001.png)

在 setup 函数中定义了响应式数据，会转变成一个 \__returned__ 的一个对象的访问器属性，针对这两个属性进行读取和赋值的时候，就会被拦截到。

在 \_sfc_render 渲染函数中，setup 所返回的对象通过 $setup 参数可以拿到，在渲染函数中，通过 $setup.name 和 $setup.age 访问这两个访问器属性，产生读取行为的拦截，从而建立了依赖关系。



**为什么Vue能实现精准更新**

**Vue 的更新是组件级别的**，通过响应式，能够知道具体是哪个组件更新了。

因为响应式数据是和 render 函数关联在一起，整个 render 函数对应的就是一整个组件的结构，回头只要响应式数据一变化，render 函数就会重新执行，生成组件新的虚拟 DOM 结构。

之后要知道具体是哪一个节点更新，就需要靠 diff 算法了。

- Vue2: 双端 diff
- Vue3: 快速 diff



**为什么Vue能实现数据共享**

在 Vue 中是可以轻松实现数据共享的。**只需要将响应式数据单独提取出来，然后多个组件依赖这个响应式数据，之后只要这个响应式数据一变，依赖该数据的组件自然也会重新运行 render，然后渲染器渲染新的 DOM**.

来看一个例子：

```js
import { reactive } from 'vue'

export const store = reactive({
  todos: [
    {
      id: 1,
      text: '学习Vue3',
      completed: false
    },
    {
      id: 2,
      text: '学习React',
      completed: false
    },
    {
      id: 3,
      text: '学习Angular',
      completed: false
    }
  ],
  addTodo(todo) {
    this.todos.push(todo)
  },
  toggleTodo(id) {
    const todo = this.todos.find((todo) => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }
})
```

> 完整的 demo 代码请参阅本节课的配套的课件。

那 Pinia 的作用呢？

Pinia 是经过了完善的测试的，会给你带来很多附加的价值，例如：

- 开发工具支持
- 热替换
- 插件机制
- 自动补全
- SSR

而且相比一个单纯的响应式数据，Pinia <u>语义</u>上面也会更好一些：

- 一个单独抽出来的 reactive 对象，从语义上来讲可能是任何东西
- 一个 Pinia 对象，从语义上来讲就是全局共享数据的仓库

这样其实也能一定程度的降低开发者的心智负担，提高代码的可读性。


## 实现响应式系统

**核心要素**

要实现一个响应式系统，最为核心的有两个部分：

1. 监听数据的读写
2. 关联数据和函数

只要把这两个部分完成了，那么整个响应式系统也就基本成型了。



**监听数据读写**

- 数据：在 JS 中，能够拦截读写的方式，要么 Object.defineProperty，要么就是 Proxy，这两个方法针对的目标是对象，因此我们这里考虑对对象类型进行监听
- 读写：虽然说是监听读写，但是细分下来要监听的行为如下：
  - 获取属性：读取
  - 设置属性：写入
  - 新增属性：写入
  - 删除属性：写入
  - 是否存在某个属性：读取
  - 遍历属性：读取



**拦截后对应的处理**

不同的行为，拦截下来后要做的事情是不一样的。整体来讲分为两大类：

- 收集器：针对读取的行为，会触发收集器去收集依赖，所谓收集依赖，其实就是建立数据和函数之间的依赖关系
- 触发器：针对写入行为，触发器会工作，触发器所做的事情就是触发数据所关联的所有函数，让这些函数重新执行

下面是不同行为对应的事情：

- 获取属性：收集器
- 设置属性：触发器
- 新增属性：触发器
- 删除属性：触发器
- 是否存在某个属性：收集器
- 遍历属性：收集器

总结起来也很简单，**只要涉及到属性的访问，那就是收集器，只要涉及到属性的设置（新增、删除都算设置），那就是触发器**。



**数组中查找对象**

因为在进行代理的时候，是进行了递归代理的，也就是说对象里面成员包含对象的话，也会被代理，这就会导致数组中成员有对象的话，是找不到的。原因很简答，比较的是原始对象和代理对象，自然就找不到。

解决方案：先正常找，找不到就在原始对象中重新找一遍



**数组改动长度**

关于数组长度的改变，也会有一些问题，如果是隐式的改变长度，不会触发 length 的拦截。

另外即便是显式的设置 length，这里会涉及到新增和删除，新增情况下的拦截是正常的，但是在删除的情况下，不会触发 DELETE 拦截，因此也需要手动处理。



**自定义是否要收集依赖**

当调用 push、pop、shift 等方法的时候，因为涉及到了 length 属性的变化，会触发依赖收集，这是我们不期望的。

最好的方式，就是由我们来控制是否要依赖收集。
## 图解EFFECT

effect 方法的作用：就是将 **函数** 和 **数据** 关联起来。

回忆 watchEffect

```js
import { ref, watchEffect } from "vue";
const state = ref({ a: 1 });
const k = state.value;
const n = k.a;
// 这里就会整理出 state.value、state.value.a
watchEffect(() => {
  console.log("运行");
  state;
  state.value;
  state.value.a;
  n;
});
setTimeout(() => {
  state.value = { a: 3 }; // 要重新运行，因为是对 value 的写入操作
}, 500);
```



effect函数的设计：

```js
// 原始对象
const data = {
  a: 1,
  b: 2,
  c: 3,
};
// 产生一个代理对象
const state = new Proxy(data, { ... });
effect(() => {
  console.log(state.a);
});
```

在上面的代码中，向 effect 方法传入的回调函数中，访问了 state 的 a 成员，然后我们期望 a 这个成员和这个回调函数建立关联。

第一版实现如下：

```js
let activeEffect = null; // 记录当前的函数
const depsMap = new Map(); // 保存依赖关系

function track(target, key) {
  // 建立依赖关系
  if (activeEffect) {
    let deps = depsMap.get(key); // 根据属性值去拿依赖的函数集合
    if (!deps) {
      deps = new Set(); // 创建一个新的集合
      depsMap.set(key, deps); // 将集合存入 depsMap
    }
    // 将依赖的函数添加到集合里面
    deps.add(activeEffect);
  }
  console.log(depsMap);
}

function trigger(target, key) {
  // 这里面就需要运行依赖的函数
  const deps = depsMap.get(key);
  if (deps) {
    deps.forEach((effect) => effect());
  }
}

// 原始对象
const data = {
  a: 1,
  b: 2,
  c: 3,
};
// 代理对象
const state = new Proxy(data, {
  get(target, key) {
    track(target, key); // 进行依赖收集
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;
    trigger(target, key); // 派发更新
    return true;
  },
});

/**
 *
 * @param {*} fn 回调函数
 */
function effect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}

effect(() => {
  // 这里在访问 a 成员时，会触发 get 方法，进行依赖收集
  console.log('执行函数')
  console.log(state.a);
});
state.a = 10;

```

第一版实现，**每个属性对应一个 Set 集合**，该集合里面是所依赖的函数，所有属性与其对应的依赖函数集合形成一个 map 结构，如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-30-005612.png" alt="image-20240530085612443" style="zoom:50%;" />

activeEffect 起到一个中间变量的作用，临时存储这个回调函数，等依赖收集完成后，再将这个临时变量设置为空即可。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-30-010642.png" alt="image-20240530090641942" style="zoom:50%;" />

**问题一**：每一次运行回调函数的时候，都应该确定新的依赖关系。

稍作修改：

```js
effect(() => {
  if (state.a === 1) {
    state.b;
  } else {
    state.c;
  }
  console.log("执行了函数");
});
```

在上面的代码中，两次运行回调函数，所建立的依赖关系应该是不一样的：

- 第一次：a、b
- 第二次：a、c

第一次运行依赖如下：

```js
Map(1) { 'a' => Set(1) { [Function (anonymous)] } }
Map(2) {
  'a' => Set(1) { [Function (anonymous)] },
  'b' => Set(1) { [Function (anonymous)] }
}
执行了函数
```

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-30-011134.png" alt="image-20240530091134221" style="zoom:50%;" />

执行 state.a = 100

依赖关系变为了：

```js
Map(1) { 'a' => Set(1) { [Function (anonymous)] } }
Map(2) {
  'a' => Set(1) { [Function (anonymous)] },
  'b' => Set(1) { [Function (anonymous)] }
}
执行了函数
Map(2) {
  'a' => Set(1) { [Function (anonymous)] },
  'b' => Set(1) { [Function (anonymous)] }
}
Map(2) {
  'a' => Set(1) { [Function (anonymous)] },
  'b' => Set(1) { [Function (anonymous)] }
}
执行了函数
```

当 a 的值修改为 100 后，依赖关系应该重新建立，也就是说：

- 第一次运行：建立 a、b 依赖
- 第二次运行：建立 a、c 依赖

那么现在 a 的值明明已经变成 100 了，为什么重新执行回调函数的时候，没有重新建立依赖呢？

原因也很简单，如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-30-012138.png" alt="image-20240530092137893" style="zoom:50%;" />

**第一次建立依赖关系的时候，是将依赖函数赋值给 activeEffect，最终是通过 activeEffect 这个中间变量将依赖函数添加进依赖列表的**。依赖函数执行完毕后，activeEffect 就设置为了 null，之后 a 成员的值发生改变，重新运行的是回调函数，但是 activeEffect 的值依然是 null，这就会导致 track 中依赖收集的代码根本进不去：

```js
function track(target, key) {
  if (activeEffect) {
    // ...
  }
}
```

怎么办呢？也很简单，**我们在收集依赖的时候，不再是仅仅收集回调函数，而是收集一个包含 activeEffect 的环境**，继续改造 effect：

```js
function effect(fn) {
  const environment = () => {
    activeEffect = environment;
    fn();
    activeEffect = null;
  };
  environment();
}
```

这里 activeEffect 对应的值，不再是像之前那样是回调函数，而是一整个 environment 包含环境信息的函数，这样当重新执行依赖的函数的时候，执行的也就是这个环境函数，而环境函数的第一行就是 activeEffect 赋值，这样就能够正常的进入到依赖收集环节。

如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-30-012752.png" alt="image-20240530092751730" style="zoom:50%;" />

**问题二：**旧的依赖没有删除

解决方案：在执行 fn 方法之前，先调用了一个名为 cleanup 的方法，该方法的作用就是用来清除依赖。

该方法代码如下：

```js
function cleanup(environment) {
  let deps = environment.deps; // 拿到当前环境函数的依赖（是个数组）
  if (deps.length) {
    deps.forEach((dep) => {
      dep.delete(environment);
      if (dep.size === 0) {
        for (let [key, value] of depsMap) {
          if (value === dep) {
            depsMap.delete(key);
          }
        }
      }
    });
    deps.length = 0;
  }
}
```

具体结构如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-30-014306.png" alt="image-20240530094306251" style="zoom:50%;" />



**测试多个依赖函数**

```js
effect(() => {
  if (state.a === 1) {
    state.b;
  } else {
    state.c;
  }
  console.log("执行了函数1");
});
effect(() => {
  console.log(state.c);
  console.log("执行了函数2");
});
state.a = 2;
```

```js
effect(() => {
  if (state.a === 1) {
    state.b;
  } else {
    state.c;
  }
  console.log("执行了函数1");
});
effect(() => {
  console.log(state.a);
  console.log(state.c);
  console.log("执行了函数2");
});
state.a = 2;
```

解决无限循环问题：

在 track 函数中，每次 state.a 被访问时，都会重新添加当前的 activeEffect 到依赖集合中。而在 trigger 函数中，当 state.a 被修改时，会触发所有依赖 state.a 的 effect 函数，这些 effect 函数中又会重新访问 state.a，从而导致了无限循环。具体来讲：

1. 初始执行 effect 时，state.a 的值为 1，因此第一个 effect 会访问 state.b，第二个 effect 会访问 state.a 和 state.c。 
2. state.a 被修改为 2 时，trigger 函数会触发所有依赖 state.a 的 effect 函数。 
3. 第二个 effect 函数被触发后，会访问 state.a，这时 track 函数又会把当前的 activeEffect 添加到 state.a 的依赖集合中。 
4. 因为 state.a 的值被修改，会再次触发 trigger，导致第二个 effect 函数再次执行，如此循环往复，导致无限循环。

要解决这个问题，可以在 trigger 函数中添加一些机制来防止重复触发同一个 effect 函数，比如使用一个 Set 来记录已经触发过的 effect 函数：

```js
function trigger(target, key) {
  const deps = depsMap.get(key);
  if (deps) {
    const effectsToRun = new Set(deps); // 复制一份集合，防止在执行过程中修改原集合
    effectsToRun.forEach((effect) => effect());
  }
}
```



**测试嵌套函数**

```js
effect(() => {
  effect(() => {
    state.a
    console.log("执行了函数2");
  });
  state.b;
  console.log("执行了函数1");
});
```

会发现所建立的依赖又不正常了：

```js
Map(1) { 'a' => Set(1) { [Function: environment] { deps: [Array] } } }
执行了函数2
Map(1) { 'a' => Set(1) { [Function: environment] { deps: [Array] } } }
执行了函数1
```

究其原因，是目前的函数栈有问题，当执行到内部的 effect 函数时，会将 activeEffect 设置为 null，如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-30-023612.png" alt="image-20240530103611905" style="zoom:50%;" />

解决方案：模拟函数栈的形式。




## 关联数据和函数

**依赖收集**

![image-20240529131604509](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-29-051604.png)



**实现Effect**

这里直接给出 Effect 实现：

```js
/**
 * 用于记录当前活动的 effect
 */
export let activeEffect = undefined;
export const targetMap = new WeakMap(); // 用来存储对象和其属性的依赖关系
const effectStack = [];

/**
 * 该函数的作用，是执行传入的函数，并且在执行的过程中，收集依赖
 * @param {*} fn 要执行的函数
 */
export function effect(fn) {
  const environment = () => {
    try {
      activeEffect = environment;
      effectStack.push(environment);
      cleanup(environment);
      return fn();
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  };
  environment.deps = [];
  environment();
}

export function cleanup(environment) {
  let deps = environment.deps; // 拿到当前环境函数的依赖（是个数组）
  if (deps.length) {
    deps.forEach((dep) => {
      dep.delete(environment);
    });
    deps.length = 0;
  }
}
```



**改造track**

之前 track 仅仅只是简单的打印，那么现在就不能是简单打印了，而是进行具体的依赖收集。

注意依赖收集的时候，需要按照上面的设计一层一层进行查找。



**改造trigger**

trigger 要做的事情也很简单，就是从我们所设计的数据结构里面，一层一层去找，找到对应的依赖函数集合，然后全部执行一次。

首先我们需要**建立一个设置行为和读取行为之间的映射关系**：

```js
// 定义修改数据和触发数据的映射关系
const triggerTypeMap = {
  [TriggerOpTypes.SET]: [TrackOpTypes.GET],
  [TriggerOpTypes.ADD]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
  [TriggerOpTypes.DELETE]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
};
```

我们前面在建立映射关系的时候，是根据具体的获取信息的行为来建立的映射关系，那么我们获取信息的行为有：

- GET
- HAS
- ITERATE

这些都是在获取成员信息，而依赖函数就是和这些获取信息的行为进行映射的。

因此在进行设置操作的时候，需要思考一下当前的设置，会涉及到哪些获取成员的行为，然后才能找出该行为所对应的依赖函数。



**懒执行**

有些时候我们想要实现懒执行，也就是不想要传入 effect 的回调函数自动就执行一次，通过配置项来实现



**添加回调**

有些时候需要由用户来指定是否派发更新，支持用户传入一个回调函数，然后将要依赖的函数作为参数传递回给用户给的回调函数，由用户来决定如何处理。


## 手写computed

**回顾computed的用法**

首先回顾一下 computed 的基本用法：

```js
const state = reactive({
  a: 1,
  b: 2
})

const sum = computed(() => {
  return state.a + state.b
})
```

```js
const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(newValue) {
    ;[firstName.value, lastName.value] = newValue.split(' ')
  }
})
```



**实现computed方法**

首先第一步，我们需要对参数进行归一化，如下所示：

```js
function normalizeParameter(getterOrOptions) {
  let getter, setter;
  if (typeof getterOrOptions === "function") {
    getter = getterOrOptions;
    setter = () => {
      console.warn(`Computed property was assigned to but it has no setter.`);
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return { getter, setter };
}
```

上面的方法就是对传入 computed 的参数进行归一化，无论是传递的函数还是对象，统一都转换为对象。



接下啦就是建立依赖关系，如何建立呢？

无外乎就是将传入的 getter 函数运行一遍，getter 函数内部的响应式数据和 getter 产生关联：

```js
// value 用于记录计算属性的值，dirty 用于标识是否需要重新计算
let value,
  dirty = true;
// 将 getter 传入 effect，getter 里面的响应式属性就会和 getter 建立依赖关系
const effetcFn = effect(getter, {
  lazy: true,
});
```

这里的 value 用于缓存计算的值，dirty 用于标记数据是否过期，一开始标记为过期方便一开始执行一次计算到最新的值。

lazy 选项标记为 true，因为计算属性只有在访问的之后，才会进行计算。



接下来向外部返回一个对象：

```js
const obj = {
  // 外部获取计算属性的值
  get value() {
    if (dirty) {
      // 第一次会进来，先计算一次，然后将至缓存起来
      value = effetcFn();
      dirty = false;
    }
    // 返回计算出来的值
    return value;
  },
  set value(newValue) {
    setter(newValue);
  },
};
return obj;
```

该对象有一个 value 访问器属性，当访问 value 值的时候，会根据当前是否为脏值来决定是否重新计算。



目前为止，我们的计算属性工作一切正常，但是这种情况，某一个函数依赖计算属性的值，例如渲染函数。那么此时计算属性值的变化，应该也会让渲染函数重新执行才对。例如：

```js
const state = reactive({
  a: 1,
  b: 2,
});
const sum = computed(() => {
  console.log("computed");
  return state.a + state.b;
});

effect(() => {
  // 假设这个是渲染函数，依赖了 sum 这个计算属性
  console.log("render", sum.value);
});

state.a++
```

执行结果如下：

```js
computed
render 3
computed
```

可以看到 computed 倒是重新执行了，但是渲染函数并没有重新执行。

怎么办呢？很简单，内部让渲染函数和计算属性的值建立依赖关系即可。

```js
const obj = {
  // 外部获取计算属性的值
  get value() {
    // 相当于计算属性的 value 值和渲染函数之间建立了联系
    track(obj, TrackOpTypes.GET, "value");
    // ...
  },
 	// ...
};
return obj;
```

首先在获取依赖属性的值的时候，我们进行依次依赖收集，这样因为渲染函数里面用到了计算属性，因此计算属性 value 值就会和渲染函数产生依赖关系。

```js
const effetcFn = effect(getter, {
  lazy: true,
  scheduler() {
    dirty = true;
    // 派发更新，执行和 value 相关的函数，也就是渲染函数。
    trigger(obj, TriggerOpTypes.SET, "value");
  },
});
```

接下来添加配置项 scheduler，之后无论是 state.a 的变化，还是 state.b 的变化，都会进入到 scheduler，而在 scheduler 中，重新将 dirty 标记为脏数据，然后派发和 value 相关的更新即可。



完整的代码如下：

```js
import { effect } from "./effect/effect.js";
import track from "./effect/track.js";
import trigger from "./effect/trigger.js";
import { TriggerOpTypes, TrackOpTypes } from "./utils.js";

function normalizeParameter(getterOrOptions) {
  let getter, setter;
  if (typeof getterOrOptions === "function") {
    getter = getterOrOptions;
    setter = () => {
      console.warn(`Computed property was assigned to but it has no setter.`);
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return { getter, setter };
}

/**
 *
 * @param {*} getterOrOptions 可能是函数，也可能是对象
 */
export function computed(getterOrOptions) {
  // 1. 第一步，先做参数归一化
  const { getter, setter } = normalizeParameter(getterOrOptions);

  // value 用于记录计算属性的值，dirty 用于标识是否需要重新计算
  let value,
    dirty = true;
  // 将 getter 传入 effect，getter 里面的响应式属性就会和 getter 建立依赖关系
  const effetcFn = effect(getter, {
    lazy: true,
    scheduler() {
      dirty = true;
      trigger(obj, TriggerOpTypes.SET, "value");
      console.log("j");
    },
  });

  // 2. 第二步，返回一个新的对象
  const obj = {
    // 外部获取计算属性的值
    get value() {
      track(obj, TrackOpTypes.GET, "value");
      if (dirty) {
        // 第一次会进来，先计算一次，然后将至缓存起来
        value = effetcFn();
        dirty = false;
      }
      // 直接计算出来的值
      return value;
    },
    set value(newValue) {
      setter(newValue);
    },
  };
  return obj;
}
```




## 手写watch

**回顾watch的用法**

```js
const x = reactive({
  a: 1,
  b: 2
})

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数
watch(
  () => x.a + x.b,
  (sum) => {
    console.log(`sum is: ${sum}`)
  }
)
```

简单总结起来，就是前面的响应式数据发生变化，重新执行后面的回调函数。回调函数的参数列表中，会传入新的值和旧的值。

另外 watch 还接收第三个参数，是一个选项对象，可以的配置的值有：

- immediate：立即执行一次回调函数
- once：只执行一次
- flush
  - post：在侦听器回调中能访问被 Vue 更新之后的所属组件的 DOM
  - sync：在 Vue 进行任何更新之前触发

watch 方法会返回一个函数，该函数用于停止侦听

```js
const unwatch = watch(() => {})

// ...当该侦听器不再需要时
unwatch()
```

**实现watch方法**

首先写一个工具方法 traverse：

```js
function traverse(value, seen = new Set()) {
  // 检查 value 是否是对象类型，如果不是对象类型，或者是 null，或者已经访问过，则直接返回 value。
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return value;
  }

  // 将当前的 value 添加到 seen 集合中，标记为已经访问过，防止循环引用导致的无限递归。
  seen.add(value);

  // 使用 for...in 循环遍历对象的所有属性。
  for (const key in value) {
    // 递归调用 traverse，传入当前属性的值和 seen 集合。
    traverse(value[key], seen);
  }

  // 返回原始值
  return value;
}
```

该方法的主要作用是递归遍历一个对象及其所有嵌套的属性，从而触发这些属性的依赖收集。

这个方法在 watch 函数中很重要，因为它确保了所有嵌套属性的依赖关系都能被追踪到，当它们变化时能够触发回调函数。

假设有一个深层嵌套的对象：

```js
const obj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3
    }
  }
};
```

那么整个遍历过程如下：

- 由于 obj 是对象，并且没有访问过，会将 obj 添加到 seen 集合里面
- 遍历 obj 的属性：
  - 访问 obj.a 是数字，会直接返回，不做进一步的处理
  - 访问 obj.b，会进入 traverse(obj.b, seen)
    - 由于 obj.b 是对象，并且未被访问过，将 obj.b 添加到 seen 集合中。
    - 遍历 obj.b 的属性：
      - 访问 obj.b.c 是数字，会直接返回，不做进一步的处理
      - 访问 obj.b.d，会进入 traverse(obj.b.d, seen)
        - 由于 obj.b.d 是对象，并且未被访问过，将 obj.b.d 添加到 seen 集合中。
        - 遍历 obj.b.d 的属性：
          - 访问 obj.b.c.e 是数字，会直接返回，不做进一步的处理

在这个过程中，每次访问一个属性（例如 obj.b 或 obj.b.d），都会触发依赖收集。这意味着当前活动的 effect 函数会被记录为这些属性的依赖。



接下来咱们仍然是进行参数归一化：

```js
/**
 * @param {*} source 
 * @param {*} cb 要执行的回调函数
 * @param {*} options 选项对象
 * @returns
 */
export function watch(source, cb, options = {}) {
  let getter;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
}
```

在上面的代码中，无论用户的 source 是传递什么类型的值，都转换为函数（这里没有考虑数组的情况）

- source 本来就是函数：直接将 source 赋值给 getter
- source 是一个响应式对象：转换为一个函数，该函数会调用 traverse 方法

接下来定义两个变量，用于存储新旧两个值：

```js
let oldValue, newValue;
```

好了，接下来轮到 effect 登场了：

```js
const effectFn = effect(() => getter(), {
  lazy: true,
  scheduler: () => {
    newValue = effectFn();
    cb(newValue, oldValue);
    oldValue = newValue;
  },
});
```

这段代码，首先会运行 getter 函数（前面做了参数归一化，已经将 getter 转换为函数了），getter 函数里面的响应式数据就会被依赖收集，当这些响应式数据发生变化的时候，就需要派发更新。

因为这里传递了 scheduler，因此在派发更新的时候，实际上执行的就是 scheduler 对应的函数，实际上也就是这三行代码：

```js
newValue = effectFn();
cb(newValue, oldValue);
oldValue = newValue;
```

这三行代码的意思也非常明确：

- newValue = effectFn( )：重新执行一次 getter，获取到新的值，然后把新的值给 newValue
- cb(newValue, oldValue)：调用用户传入的换掉函数，将新旧值传递过去
- oldValue = newValue：更新 oldValue



再往后走，代码就非常简单了，在此之前之前，我们先把 scheduler 对应的函数先提取出来：

```js
const job = () => {
  newValue = effectFn();
  cb(newValue, oldValue);
  oldValue = newValue;
};

const effectFn = effect(() => getter(), {
  lazy: true,
  scheduler: job
});
```

然后实现 immediate，如下：

```js
if (options.immediate) {
  job();
} else {
  oldValue = effectFn();
}
```

immediate 的实现无外乎就是立马派发一次更新。而如果没有配置 immediate，实际上也会执行一次依赖函数，只不过算出来的值算作旧值，而非新值。



接下来执行取消侦听，其实也非常简单：

```js
return () => {
  cleanup(effectFn);
};
```

就是返回一个函数，函数里面调用 cleanup 将依赖清除掉即可。

你会发现只要前面响应式系统写好了，接下来的这些实现都非常简单。



最后我们再优化一下，添加 flush 配置项的 post 值的支持。flush 的本质就是指定调度函数的执行时机，当 flush 的值为 post 的时候，代表调用函数需要将最终执行的更新函数放到一个微任务队列中，等待 DOM 更新结束后再执行。

代码如下所示：

```js
const effectFn = effect(() => getter(), {
  lazy: true,
  scheduler: () => {
    if (options.flush === "post") {
      Promise.resolve().then(job);
    } else {
      job();
    }
  },
});
```

完整代码如下：

```js
import { effect, cleanup } from "./effect/effect.js";

/**
 * @param {*} source 
 * @param {*} cb 要执行的回调函数
 * @param {*} options 选项对象
 * @returns
 */
export function watch(source, cb, options = {}) {
  let getter;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  // 用于保存上一次的值和当前新的值
  let oldValue, newValue;

  // 这里的 job 就是要执行的函数
  const job = () => {
    newValue = effectFn();
    cb(newValue, oldValue);
    oldValue = newValue;
  };

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      if (options.flush === "post") {
        Promise.resolve().then(job);
      } else {
        job();
      }
    },
  });

  if (options.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }

  return () => {
    cleanup(effectFn);
  };
}

function traverse(value, seen = new Set()) {
  // 检查 value 是否是对象类型，如果不是对象类型，或者是 null，或者已经访问过，则直接返回 value。
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return value;
  }

  // 将当前的 value 添加到 seen 集合中，标记为已经访问过，防止循环引用导致的无限递归。
  seen.add(value);

  // 使用 for...in 循环遍历对象的所有属性。
  for (const key in value) {
    // 递归调用 traverse，传入当前属性的值和 seen 集合。
    traverse(value[key], seen);
  }

  // 返回原始值
  return value;
}
```


> 本文所有源码均在：https://github.com/Sunny-117/tiny-vue/tree/main/tutorial

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
- [Vue 3 设计哲学与源码揭秘](https://juejin.cn/column/7391745629876830208)
- [esbuild 原理与应用实战](https://juejin.cn/column/7285233095058718756)
- [js-challanges 题解来了，迎接你的校招提前批](https://juejin.cn/column/7244788137410560055)
