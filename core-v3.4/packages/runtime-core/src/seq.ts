export default function (arr) {
    const result = [0]
    const len = arr.length
    const p = result.slice(0) // 记录节点的前一个索引
    let start, end, middle

    for (let i = 0; i < len; i++) {
        const item = arr[i]
        if (item !== 0) {  // vue3中处理掉数组为0的项  为0的项表示新增
            let resultLastIndex = result[result.length - 1]
            if (arr[resultLastIndex] < item) {
                p[i] = result[result.length - 1]
                result.push(i)
                continue
            }

            // 二分查找
            start = 0
            end = result.length - 1
            while (start < end) {
                middle = (start + end) / 2 | 0 // 取整
                if (arr[result[middle]] < item) {
                    start = middle + 1
                } else {
                    end = middle
                }
            }

            if (item < arr[result[end]]) { // 此时start end都相等
                p[i] = result[end - 1]
                result[end] = i
            }
        }
    }

    // 需要创造一个前驱节点，进行倒序追溯   
    let l = result.length
    let last = result[l - 1]
    while (l-- > 0) {
        // p的列表是前驱节点 倒序向前找
        result[l] = last
        last = p[last] // 在数组中找到最后一个
    }

    return result

}