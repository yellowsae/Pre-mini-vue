

import { reactive } from './test/index.js'
import { h } from './test/h.js'
// App 组件
export default {
  // context 参数： 就是  setup() 的返回值
  render(context) {
    // const div = document.createElement('div')
    // div.innerHTML = context.state.count  //  获取响应式对象
    // return div

    // 分析 创建 视图的部分
    // 1. tag 
    // 2. props
    // 3. children

    // 返回 h() 创建的一个虚拟DOM 对象
    return h(
      'div',
      {
        id: 'id-app------' + context.state.count,
        class: 'class-app'
      },
      // String(context.state.count)
      [h('p', null, 'test1'), h('p', null, 'test2')]  // array 的情况
    )
  },
  setup() {
    const state = reactive({
      count: 0
    })
    window.state = state
    return {
      state
    }
  },

}
