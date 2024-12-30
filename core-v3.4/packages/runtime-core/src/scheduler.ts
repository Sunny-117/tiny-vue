const queue = []
let isFlushing = false
const resolvePromise = Promise.resolve()

export function queueJob(job) {
    if (!queue.includes(job)) {
        queue.push(job)
    }

    if (!isFlushing) {
        isFlushing = true
        // 使用一个已解决的 Promise 来安排一个微任务在事件循环的后面执行。这确保了所有同步代码执行完后才会执行这个微任务，从而达到批处理的效果。
        resolvePromise.then(() => {
            isFlushing = false
            const copy = queue.slice(0)// 先拷贝 在执行 防止执行过程中改变引起的死循环
            queue.length = 0
            copy.forEach((job) => job())
            copy.length = 0
        })
    }
}