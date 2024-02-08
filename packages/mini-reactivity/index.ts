let activeEffect = undefined;
const targetMap = new WeakMap();

export const effect = function (fn) {
    activeEffect = fn;
    fn();
}

export const track = function (target, key) {
    const dep = targetMap.get(target) || new Map();
    const funcs = dep.get(key) || new Set();
    funcs.add(activeEffect);
    dep.set(key, funcs);
    targetMap.set(target, dep);
}

export const trigger = function (target, key) {
    const dep = targetMap.get(target);
    if (dep && dep.get(key)) {
        dep.get(key).forEach(fn => fn());
    }
}

export const reactive = function (target) {
    return new Proxy(target, {
        get(target, key, reciever) {
            track(target, key);
            return Reflect.get(target, key, reciever);
        },
        set(target, key, value, reciever) {
            const res = Reflect.set(target, key, value, reciever);
            trigger(target, key);
            return res;
        }
    });
}
