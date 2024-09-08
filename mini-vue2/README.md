# mini-vue2

- 超级 mini 版本的 Vue2 实现

## Installation

```bash
pnpm i mini-vue2
```

## usage

```js
// index.js
import Vue from 'mini-vue2'
new Vue({
    el: "#app",
    data: {
        name: "sunny",
        age: 18,
        addr: {
            province: "heilongjiang",
            city: "city",
        },
    },
});
```

```html
<div id="app">
  <p>姓名：{{name}}</p>
  <p>年龄：{{age}} <button onclick="vm.age++">增加年龄</button></p>
  <dl>
    <dt>住址</dt>
    <dd>省份：{{addr.province}}</dd>
    <dd>城市：{{addr.city}}</dd>
  </dl>
  修改省份： <input type="text" oninput="vm.addr.province = this.value" />
</div>
```

![image](https://github.com/Sunny-117/mini-vue2/assets/73089592/cae4e691-fc7f-466c-b6e1-4a98970871a7)


## License

[MIT](./LICENSE) License © 2023-PRESENT [Sunny-117](https://github.com/Sunny-117)
