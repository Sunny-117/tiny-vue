import { isObject } from "shared";

/**
 * 将原始对象的某个属性添加到代理对象中
 * @param {*} originalObj 
 * @param {*} targetObj 
 * @param {*} prop 属性名
 * @param {*} callback 
 */
function proxyProp(originalObj, targetObj, prop, callback) {
    if (isObject(originalObj[prop])) {
        var newTarget = {}; //新的要代理该属性的对象
        //要代理的属性是一个对象
        createResponsive(originalObj[prop], newTarget, callback);
        Object.defineProperty(targetObj, prop, {
            get: function () {
                return newTarget;
            },
            set: function (value) {
                originalObj[prop] = value;
                newTarget = value;
                callback && callback(prop);
            }
        })
    }
    else {
        //要代理的属性不是一个对象
        Object.defineProperty(targetObj, prop, {
            get: function () {
                return originalObj[prop];
            },
            set: function (value) {
                originalObj[prop] = value;
                callback && callback(prop);
            }
        })
    }
}

/**
 * 将原始对象的所有属性，提取到代理对象中
 * @param {*} originalObj 原始对象
 * @param {*} targetObj 代理对象
 * @param {*} callback 当代理对象的属性被赋值的时候，需要运行的回调函数
 */
export default function createResponsive(originalObj, targetObj, callback) {
    for (var prop in originalObj) {
        proxyProp(originalObj, targetObj, prop, callback);
    }
}