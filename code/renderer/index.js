
// mountElement() , 将虚拟DOM 转为 真实DOM，并添加到 容器中

// 把虚拟DOM 转为 真实DOM,  本质也就是 初始化 Element 的一个过程
export function mountElement(vnode, container) {
  // vnode 虚拟节点  
  // container 容器

  const { tag, props, children } = vnode
  // tag   设置节点
  const el = document.createElement(tag)
  // props  设置属性
  if (props) { // 判断不为空
    for (const key in props) {
      el.setAttribute(key, props[key])
    }
  }
  // children  设置子节点
  // 设置children 
  // 1. 可以接收一个 string
  if (typeof children === 'string') {
    // 创建一个节点 
    const textNode = document.createTextNode(children)
    el.append(textNode)
  } else if (Array.isArray(children)) {
    // 2. 可以接收一个数组
    // 按照递归方法， 添加到数组的上一个容器中
    children.forEach((v) => {
      // 递归
      mountElement(v, el) // 但是这里的容器是 el ，el 就是下一个子节点的容器
    })
  }


  // 最后将真实DOM 添加到容器中
  container.append(el)
}
