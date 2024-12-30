import { DirtyLevels } from "./constants"

export function effect(fn, options?) {
    // 创建一个effect,只要依赖的属性变化就要执行回调
    const _effect = new ReactiveEffect(fn, () => {
        _effect.run()
    })
    // 初始化的时候执行一次
    _effect.run()

    if (options) {
        Object.assign(_effect, options) // 用户设定的 覆盖掉内置的
    }
    const runner = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}

export let activeEffect

/**
 * fn：依赖函数
 * scheduler： 调度函数，依赖变化后重新运行的函数
 */
export class ReactiveEffect {
    _trackId = 0 // 用于记录effect执行了几次 防止一个属性在effect中多次收集依赖(只收集一次)
    deps = [] // 用于记录存放了哪些依赖
    _depLength = 0 // 依赖项下标
    _running = 0
    _dirtyLevel = DirtyLevels.Dirty
    public active = true //  创建的effect默认为响应式

    // fn 用户编写的函数 public是让属性直接挂在到实例上
    // 如果fn中依赖的数据发生变化后，需要重新调用 即调用run方法
    constructor(public fn, public scheduler) { }

    public get dirty() {
        return this._dirtyLevel === DirtyLevels.Dirty
    }

    public set dirty(v) {
        this._dirtyLevel = v ? DirtyLevels.Dirty : DirtyLevels.NoDirty
    }

    run() {
        this._dirtyLevel = DirtyLevels.NoDirty // 每次运行后effect变为NoDirty
        if (!this.active) { // 非响应式 执行完啥也不干
            return this.fn()
        }
        // 针对effect里面内嵌effect的处理
        let lastEffect = activeEffect
        try {
            activeEffect = this
            // effect执行前，需要将上一次的依赖清空 effect.deps
            preCleanEffect(this)
            this._running++
            return this.fn()
        } finally {
            activeEffect = lastEffect
            this._running--
            postCleanEffect(this);
        }
    }


    stop() {
        if (this.active) {
            this.active = false
            preCleanEffect(this)
            postCleanEffect(this)
        }
    }
}

// 双向记忆 effect记录deps deps收集effect
export function trackEffect(effect, dep) {
    // 简易diff算法
    if (dep.get(effect) !== effect._trackId) {
        // {flag, name}
        //    ⬇⬇⬇
        // {flag, age}
        dep.set(effect, effect._trackId) // 优化多余的收集
        let oldDep = effect.deps[effect._depLength]
        if (oldDep !== dep) {
            if (oldDep) {
                // 删掉老的
                cleanDepEffect(oldDep, effect)
            }
            effect.deps[effect._depLength++] = dep // 永远按照本次最新的来存放
        } else {
            effect._depLength++
        }
    }
}


export function triggerEffect(dep) {
    for (const effect of dep.keys()) {
        if (effect._dirtyLevel < DirtyLevels.Dirty) {
            // 当前这个值不脏，但是触发更新后需要把值变为脏值
            effect._dirtyLevel = DirtyLevels.Dirty
        }
        if (effect.scheduler) {
            if (!effect._running) {
                effect.scheduler()
            }
        }
    }
}

function preCleanEffect(effect) {
    effect._depLength = 0
    effect._trackId++ // 每次执行id+1，如果当前同一个effect执行，id相同
}

// 把多余的依赖删掉
// [flag, age, xxx, bbb, ccc]
//    ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇
// [flag] -> effect._depsLength = 1
function postCleanEffect(effect) {
    if (effect.deps.length > effect._depLength) {
        for (let i = effect._depLength; i < effect.deps.length; i++) {
            cleanDepEffect(effect.deps[i], effect)
        }
        effect.deps.length = effect._depLength
    }
}


function cleanDepEffect(dep, effect) {
    dep.delete(effect)
    if (dep.size === 0) {
        dep.cleanup() // 从映射表中把属性本身删除 {flag, name}->{flag, age} 删除name属性
    }
}