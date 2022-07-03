

export function mountElement(vnode, container) {
  // vnode : 虚拟节点
  // container : 容器

  // 解构 
  const { tag, props, children } = vnode

  // 1. 创建真实节点
  const el = document.createElement(tag)

  // 2. 设置属性
  if (props) { // 判断不为空
    for (const key in props) {
      el.setAttribute(key, props[key])
    }
  }

  // 3. 添加子节点

  // 1. 子节点为字符串的情况
  if (typeof children === 'string') {
    el.innerHTML = children
  } else if (Array.isArray(children)) {
    // 2. 子节点为数组的情况
    // 执行递归方法
    children.forEach((v) => {  // 这个参数 也是一个虚拟节点
      mountElement(v, el)  // 递归， 但是容器是 el 
    })
  }

  // 4. 添加到容器中
  container.appendChild(el)
}
