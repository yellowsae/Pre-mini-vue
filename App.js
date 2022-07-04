
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
// const { effectWatch } = require('./Reconfiguration/effect')
// const { reactive } = require('./Reconfiguration/reactive')

// let a = reactive({
//   age: 19
// })

// let b
// effectWatch(() => {
//   b = a.age + 10
//   console.log(b)
// })

// a.age++



// vue3 
// App组件实现 

// const { effectWatch, reactive }  = require('./Reconfiguration/test/index.js')
import { effectWatch, reactive } from './code/reactivity/reactivity.js'
import { h } from './code/h.js'

// 导出APP
export default {  // const App = {} 

  // template  编译 -> render 函数
  render(context) {
    // 构建视图 
    // view = b

    // 使用 effectWatch() ， 这样才能达到 值变更后， 视图刷新 
    // effectWatch(() => {

    // 目前缺点：  view  -> 每次都需要重新创建，如果 DOM很多， 则会占用很多内存
    // 优化点： 计算出计算出最小的更新点  
    // 引入 VDOM 虚拟DOM, 虚拟节点 -> 纯粹的JS对象  （虚拟DOM本质是 JS对象），引入虚拟DOM就是为了方便引入 diff, 让性能提升更高 
    // 可以在这个JS对象，上做一些算法， -->  也就是 Diff 算法

    // 清空视图 reset 
    // document.body.innerHTML = `` 


    //   // 用户 创建 的视图 -> 用户使用
    //   const div = document.createElement('div') 
    //   // div.innerHTML = "hello world"
    //   div.innerHTML = context.state.count  // 用户操作视图

    //   // 插入视图  root
    //   // document.body.append(div)
    //   // })


    // // effectWatch 在  App.js mount() 使用 
    // return div

    // 先注释上边
    // 分析 创建 视图的部分 

    // 1. tag   标签名称
    // 2. props  属性
    // 3. children 子节点

    // 使用 h() 函数，创建的虚拟DOM
    return h("div", {
      id: 'id-app-' + context.state.count,
      class: 'class-app'
    },
      // 使用字符串 为子节点
      // String(context.state.count) 
      // 使用 数组 为子节点
      [h('p', null, String(context.state.count)), h('p', null, 'test2')]
    )  // 创建虚拟DOM
    // render 返回值 而不是 一个节点了， 而是虚拟DOM
    // String(context.state.count) 子节点必须要为 string 或者 Array
  },

  setup() {  // 模拟 vue3 响应式
    // a = 响应式数据 

    // 定义响应式数据
    const state = reactive({
      count: 0
    })


    window.state = state  // 为了在浏览器控制台中，能够看到 state 的值
    return {
      state
    }
  }
}


// App.render(App.setup()) 

// 修改名字 App.js



// 目前问题： 所有做好的 函数方法 effectWatch | render() 这些方法，用户不需要知道 这些执行细节
// 
// 所以需要进行封装



/**
 * App组中， setup() 函数的作用：是用户的写逻辑 导出数据的函数 
 * 
 * render(context) 函数的作用：接收context参数， 这个参数就是 setup()的返回值
 * 然后， 在这个函数进行模板的编译，（使用到了其他函数库， 工具方法），最后返回一个视图节点。
 */




/**
 * 转移前，到这里 感觉已经很像 vue 了， 但是还有很大一部分功能没有完成，
 *  render() 函数是一个固定的， vue的render函数是一个编译 template模板后，形成一个 render() 函数
 * 但是中间，还有将 template 编译成虚拟DOM，再把虚拟DOM转化成 render() 函数。再这里面 虚拟DOM起到一个很重要的作用（桥梁）
 * 还有，优化方面，如果没有 diff 算法，那每次刷新都是 虚拟DOM 转为 真实DOM，就很消耗内存 。 
 * 
 */
