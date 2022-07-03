

import { reactive } from './test/index.js'
// App 组件
export default {
  // context 参数： 就是  setup() 的返回值
  render(context) {
    const div = document.createElement('div')
    div.innerHTML = context.state.count  //  获取响应式对象
    return div
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
