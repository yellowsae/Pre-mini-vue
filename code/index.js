

// 仿照 vue 封装组件 


import { effectWatch } from './reactivity/reactivity.js'
import { mountElement, diff } from './renderer/index.js'

// 构建
// 导出 createApp() 函数
export function createApp(rootComponent) {  // 接收 rootComponent 根组件

  return {
    mount(rootContainer) {  // 接收 根容器  -> <div id="app"></div>  这个就是根容器

      // 调用 组件的 setup() 
      const context = rootComponent.setup()
      // 定义一个状态代表这个东西是否被挂载过
      let isMounted = false  // 一开始时候没有被挂载过

      // 声明一个 变量 保存上一个挂载的节点, 在更新之后呢就拿到上一个的老的节点
      let prevSubTree = null  // 上一个挂载的节点




      // 使用 effectWatch() 把变化的模板 给包裹起来， 达到响应式的效果，收集依赖， 触发依赖
      effectWatch(() => {  // 这样就不需要用户自己调用 render() 和 append() 来渲染视图了

        // 调用 render() 函数， 把setup() 返回的数据
        // render() 执行编译模板后,  返回一个 element 节点

        // const element = rootComponent.render(context)  // 使用 h() 函数，创建的虚拟DOM，返回值是虚拟DOM,而不是一个节点了， 而是虚拟DOM


        // 判断是否挂载过
        if (!isMounted) {  // 如果没有被挂载过
          // 这里就是一个初始化的过程
          // init() 的操作，按照原来的流程来

          // 把已经挂载过状态给 设置 为 true
          isMounted = true

          // 清空模板
          rootContainer.innerHTML = ``

          // 返回的是一个虚拟DOM
          const subTree = rootComponent.render(context)
          // console.log(subTree) // 虚拟节点

          // mountElement() 将虚拟DOM，转为真实的DOM
          mountElement(subTree, rootContainer)  // subTree: 虚拟DOM，  rootContainer 容器
          // 把上一个挂载的节点，保存起来
          prevSubTree = subTree
        } else {
          // 这里表示 已经挂载过了，那么就是更新的过程
          // update

          // 更新的节点 
          const subTree = rootComponent.render(context)  // 虚拟节点

          // 使用 diff算法
          diff(prevSubTree, subTree) // oldVnode , newVnode

          // 更新上一个的老的节点 
          prevSubTree = subTree
        }


        // 在使用 diff 算法
        // diff()  算法需要  newVnode 和 oldVnode


        // 添加 编译渲染的节点 挂载 到  容器中
        // rootContainer.append(subTree)
      })
    }
  }
}


/**
 * createApp 就相当于 vue3 中的APP
 * 内部执行： 
 *  1. createApp() 接收一个组件 App , 这就是根组件
 *  2. createApp() 返回一个 mount()函数， 并接收一个参数,   这个参数就是 根容器
 *  3. 调用执行 App组件的 setup() 函数, 并返回一个 context 对象, 也就是 vue3 的setup()中的返回值， 是一个对象{} 
 *  4. 使用 effectWatch() 把 App函数的 render() 函数 给包裹起来, render() 函数是进行编译模板后,  返回一个 element 节点， 它是会变化的
 *  5. 把 element 节点 添加到 根容器中， 然后再清空根容器的内容， 达到响应式页面
 *  
 * 这就是 createApp() 的执行过程, 其中setup() 和 render() 在 APP组件内部执行
 */




/**
 * 第二课
 * 在 render() 函数中引入了 VDOM 这一层，  h() 函数用于创建虚拟DOM 
 * 
 * 然后  mountElement() 函数再把  虚拟DOM转为真实的DOM 
 * 
 * 
 * 未解决： 
 *  - 如何从 template 转化为 虚拟DOM （需要 vue的 编译器  compiler） 
 *  -  diff 算法
 */
