
// const { effect, reactive } = require('@vue/reactivity')




// version1  表示原始的 响应式

// let a = 10
// let b = a + 10
// console.log(b)

// // a 发生变化 
// a = 20
// b = a + 10  // 继续执行 b 的值发生变化 
// console.log(b)




// version2  封装 b 的值变化

// let a = 10
// let b;

// function update() {
//   b = a + 10
//   console.log(b)
// }

// update()

// // a 发生变化 
// a = 20
// update()




// version3  
// a 发生了变更，我想让 b 自动更新
// 使用 响应式库，比如 vue3 的 reactivity 库， 也就是它的 响应式库

// 安装 pnpm i @vue/reactivity



// let a = reactive({
//   age: 10
// })

// let b
// effect(() => {
//   // effect 接收函数， 这个函数 初始化时候会执行一次
//   b = a.age + 10
//   console.log(b)
// })

// // 当 响应式对象 a 发生变化时候 再调用一次  effect 中的函数 
// a.age = 20

// 输出，   达到目的： 没有调用 effect , 当 a 发生改变时候 b 的值自动更新(有调用了一次effect)
// 20
// 30

/**
 * 总结： 使用 vue3 的 reactivity 响应式时， effect 函数的作用是：
 *  初始时侯调用一次， 当响应式的对象数据发生变化时候， 再次调用，这就是 vue3 的响应式原理的核心
 */





// version4 
// 使用自己模拟的 响应式
// const { effectWatch, reactive } = require('./code/reactivity/index.js')

// let a = reactive({
//   age: 19
// })

// let b
// effectWatch(() => {
//   b = a.age + 10
//   console.log(b)
// })

// a.age++

// 29
// 30





// version5  
// 使用自己模拟的 响应式 -> 在敲过4遍后
// 重构方式
const { effectWatch } = require('./Reconfiguration/effect')
const { reactive } = require('./Reconfiguration/reactive')

let a = reactive({
  age: 19
})

let b
effectWatch(() => {
  b = a.age + 10
  console.log(b)
})

a.age++
