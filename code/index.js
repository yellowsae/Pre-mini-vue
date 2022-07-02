

// 仿照 vue 封装组件 


import { effectWatch } from '../Reconfiguration/test/index.js'
// 构建
export function createApp(rootComponent) {  // 接收 rootComponent 根组件

  return {
    mount(rootContainer) {  // 接收 根容器  -> <div id="app"></div>  这个就是根容器

      // 调用 组件的 setup() 
      const context = rootComponent.setup()


      // 使用 effectWatch() 把变化的模板 给包裹起来 
      effectWatch(() => {  // 这样就不需要用户自己调用 render() 和 append() 来渲染视图了

        rootContainer.innerHTML = ``
        // 调用 render() 函数， 把setup() 返回的数据
        // render() 执行编译模板后,  返回一个 element 节点

        const element = rootComponent.render(context)
        // 添加 编译渲染的节点 挂载 到  容器中
        rootContainer.append(element)
      })

    }
  }
}
