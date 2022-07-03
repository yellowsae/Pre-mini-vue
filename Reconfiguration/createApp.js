

import { effectWatch } from './test/index.js'
import { mountElement } from './test/renderer/index.js'
// 导出createApp() 
export function createApp(rootComponent) {
  // 返回一个对象
  return {
    mount(rootContainer) {

      const context = rootComponent.setup()  // 返回 context 对象、state 对象、 响应式对象

      // 将变化的数据，使用响应式 effect 包裹起来， 这样才能 保存依赖，和触发依赖
      effectWatch(() => {
        // 之前的代码
        rootContainer.innerHTML = ``  // 清空之前的容器内容
        // const element = rootComponent.render(context)   // 执行 render()返回
        // rootContainer.append(element)

        // 添加虚拟DOM 和 h() 函数代码
        const subTree = rootComponent.render(context)
        // console.log(subTree)  // 查看虚拟DOM

        //  将虚拟DOM 转为 真实DOM 并添加到容器中
        mountElement(subTree, rootContainer)
        // 参数： subTree 虚拟DOM，  rootContainer 容器
      })
    }
  }
}
