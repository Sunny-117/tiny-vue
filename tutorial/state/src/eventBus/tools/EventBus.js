import mitt from 'mitt'
// class EventBus {
//   constructor() {
//     // 维护一个事件列表
//     this.events = {}
//   }

//   /**
//    * 订阅事件
//    * @param {*} event 你要订阅哪个事件
//    * @param {*} listener 对应的回调函数
//    */
//   on(event, listener) {
//     if (!this.events[event]) {
//       // 说明当前没有这个类型
//       this.events[event] = []
//     }
//     this.events[event].push(listener)
//   }

//   /**
//    * 发布事件
//    * @param {*} event 什么类型
//    * @param {*} data 传递给回调函数的数据
//    */
//   emit(event, data) {
//     if (this.events[event]) {
//       // 首先有这个类型
//       // 通知这个类型下面的所有的订阅者（listener）执行一遍
//       this.events[event].forEach((listener) => {
//         listener(data)
//       })
//     }
//   }

//   /**
//    * 取消订阅
//    * @param {*} event 对应的事件类型
//    * @param {*} listener 要取消的回调函数
//    */
//   off(event, listener) {
//     if (this.events[event]) {
//       // 说明有这个类型
//       this.events[event] = this.events[event].filter((item) => {
//         return item !== listener
//       })
//     }
//   }
// }

// const eventBus = new EventBus()
const eventBus = mitt()
export default eventBus
