

// 模拟 vue3 的响应式

// 实现 effect 
// effect(() => {}) 的目的：
// 1. 接收一个函数，effect 一上来 会执行一次， 
// 2.  当a响应式对象的值发生改变之后， effect 再次执行一次


// effect 的核心 ：
//  1. 收集依赖
//  2. 然后触发依赖


// 那么这个依赖是什么?  其实依赖就是 在响应式对象的值发生的变化！ 其实就是 effect的那个函数 Fn()



let currentEffect;  // 定义一个全局变量来建立  Dep 存储依赖，和 effect 依赖得关系

// 声明依赖的类
class Dep {
  constructor(val) {
    this._val = val
    this.effects = new Set();  //  定义effects 用于存储依赖， 使用 Set() 集合， 因为依赖不能重复，所以使用 Set
  }

  // 当读取到val时候进行代理
  get value() {
    this.depend()
    return this._val
  }

  set value(newVal) {
    this._val = newVal
    this.notice()
  }

  // 1. 收集依赖
  depend() {
    if (currentEffect) {  // 如果有依赖
      this.effects.add(currentEffect)
    }
  }

  // 2. 触发依赖
  notice() {
    // 循环 this.effect  然后执行它里面的 依赖
    this.effects.forEach(effect => {
      effect()
    })
  }
}


// 实现 effect 的逻辑 
function effectWatch(effect) {  // effect 就是要存储的依赖， 是一个函数
  // 使用全局变量存储依赖
  currentEffect = effect
  effect()
  // dep.depend()  // 执行添加依赖
  currentEffect = null  // 收集到依赖后，释放全局变量的依赖
}



// let dep = new Dep(10) // 初始时候 模拟，而不是使用reactive()
// let b
// effectWatch(() => {
//   b = dep.value + 10
//   console.log(b)
// })

// dep.value = 20











// 实现 reactive
// reactice 将XXX 变为一个响应式
// 因为 目前已经实现了 dep ， dep 主要针对于单个值的 number | string

// 在 vue3 中 reactive 主要针对于 Obj | Array

// 要怎么实现对 Obj | Array 的数据 进行一个响应式 ？
// 1. 可以使用 Map 数据结构 (targetMap)，将对应的对象中的 key 存储起来 (depsMap)
// 2. 达到 一个 key 对应一个  dep 的目的 


const targetMap = new Map();  // 用于存储 target(对象)  的Map


function getDep(target, key) {
  let depsMap = targetMap.get(target)  // 通过对象获取 对应的 depsMap 
  if (!depsMap) {
    depsMap = new Map();   // depsMap 用于存储 key 对应的 dep, 它们之间的映射关系
    targetMap.set(target, depsMap) // targetMap 写入数据，通过对象访问 depsMap 
  }

  let dep = depsMap.get(key)  // 通过 key 获取 key 对应的 dep 
  if (!dep) {
    dep = new Dep()  // 生成 每一个 key 对应的 dep
    depsMap.set(key, dep)  // 
  }
  return dep
}


function reactive(raw) {  // raw  被代理的对象

  // 把 raw 对象进行代理使用 Proxy
  return new Proxy(raw, {
    // 进行代理的逻辑
    get(target, key) {

      let dep = getDep(target, key)
      // 2. 拿到 dep 后， 进行收集依赖 
      dep.depend()
      return Reflect.get(target, key)  // 将读取的值返回 
    },

    set(target, key, value) {

      let dep = getDep(target, key)
      // 结果
      let result = Reflect.set(target, key, value)
      // 2. 拿到 dep 后，执行触发依赖
      dep.notice()  // 
      return result
    }
  })
}

// 代理对象
// const user = reactive({
//   age: 10
// })
// let doubel
// effectWatch(() => {
//   doubel = user.age + 10
//   console.log(doubel)
// })
// // 修改数据
// user.age = 20
// 20
// 30



//  CJS 的模块导出
module.exports = {
  effectWatch,
  reactive
}
