

import { effectWatch } from './test/index.js'

// 导出createApp() 
export function createApp(rootComponent) {
  // 返回一个对象
  return {
    mount(rootContainer) {

      const context = rootComponent.setup()  // 返回 context 对象、state 对象、 响应式对象
      effectWatch(() => {
        rootContainer.innerHTML = ``
        const element = rootComponent.render(context)   // 执行 render()返回
        rootContainer.append(element)
      })
    }
  }
}
