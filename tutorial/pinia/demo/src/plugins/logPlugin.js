export function logPlugin({ store }) {
  // 监听所有的 action
  // 当触发了某一个 action 的时候，会执行这个回调函数
  /**
   * name: 本次触发 action 的名称
   * args：触发 action 时传入的参数
   * after：action 执行成功后的回调函数
   * onError：action 执行失败后的回调函数
   */
  store.$onAction(({ name, args, after, onError }) => {
    // 记录开始时间
    const startTime = Date.now()

    console.log(`Action ${name} started with arguments: ${JSON.stringify(args)}`)

    // action 执行成功后的回调函数
    // result 是 action 执行成功后的返回值
    after((result) => {
      // 记录结束时间
      const endTime = Date.now()
      console.log(
        `Action ${name} finished in ${endTime - startTime}ms with result: ${JSON.stringify(result)}`
      )
    })

    onError((error) => {
      // 记录结束时间
      const endTime = Date.now()
      console.error(`Action ${name} failed in ${endTime - startTime}ms with error: ${error}`)
    })
  })
}
