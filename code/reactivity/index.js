

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
  // 使用全局比哪里存储依赖
  currentEffect = effect
  effect()
  // dep.depend()  // 执行添加依赖
  currentEffect = null  // 收集到依赖后，释放全局变量的依赖
}


let dep = new Dep(10)
let b
effectWatch(() => {
  console.log('---effect---')
  b = dep.value + 10
  console.log(b)
})

dep.value = 20



// 实现 reactive
