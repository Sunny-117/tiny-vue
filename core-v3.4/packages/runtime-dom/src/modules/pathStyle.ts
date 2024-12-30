
export default function patchStyle(el, preValue = {}, nextValue) {
    let style = el.style
    for (let key in nextValue) {
        style[key] = nextValue[key]
    }

    if (preValue) {
        for (let key in preValue) {
            if (nextValue && nextValue[key] === null) {
                style[key] = null   
            }
        }
    }
}
