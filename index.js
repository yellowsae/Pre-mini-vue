
const { effect, reactive } = require('@vue/reactivity')



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



let a = reactive({
  age: 18
})

let b
effect(() => {
  b = a.age + 1
  console.log(b)
})


a.age = 20


