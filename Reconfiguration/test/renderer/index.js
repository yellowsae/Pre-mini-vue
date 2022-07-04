export function diff(n1, n2) {

  // 1. tag
  if (n1.tag !== n2.tag) {
    n1.el.replaceWith(document.createElement(n2.tag))
  } else {
    // 2. props 
    const el = (n2.el = n1.el)

    const { props: newProps } = n2
    const { props: oldProps } = n1

    if (newProps && oldProps) {
      Object.keys(newProps).forEach(key => {
        if (newProps[key] !== oldProps[key]) {
          el.setAttribute(key, newProps[key])
        }
      })
    }

    if (oldProps) {
      Object.keys(oldProps).forEach(key => {
        if (!newProps) {
          el.removeAttribute(key)
        }
      })
    }
    // 3. children
    
    // 3. children -> （暴力的解法）
    // 3.1:   if  newChildren -> string  (1. oldChildren -> string , 2. oldChildren -> [])
    // 3.2:   if  newChildren -> array  (1. oldChildren -> string , 2. oldChildren -> [])
    // 四种情况
    const { children: newChildren } = n2
    const { children: oldChildren } = n1

    if (typeof newChildren === 'string') { // 当新节点是 string 时
      // 如果老的节点是字符串，那么就需要更新
      if (typeof oldChildren === 'string') {  // 当新节点和老节点同为 string 时
        // 直接 string 比较 
        if (newChildren !== oldChildren) {
          // 直接修改
          el.textContent = newChildren
        }
      } else if (Array.isArray(oldChildren)) { // 如果老的节点是数组，新节点是 string 
        el.textContent = newChildren
      }
    } else if (Array.isArray(newChildren)) {  // 当新节点是 array 时
      if (typeof oldChildren === 'string') { // 当新节点是 array ，老节点是 string 时
        el.innerHTML = ``  // 清空
        // 使用 mountElement() 创建 节点
        mountElement(n2, el)
      } else if (Array.isArray(oldChildren)) {
        // 当新节点是 array ，老节点是 array 时

        const length = Math.min(newChildren.length, oldChildren.length)

        // 这里不需要了解
        // 处理公共的 vnode 
        for (let index = 0; index < length; index++) {
          const newVnode = newChildren[index]
          const oldVnode = oldChildren[index]
          diff(oldVnode, newVnode)
        }

        if (newChildren.length > length) {
          // 创建节点 
          for (let index = length; index < newChildren.length; index++) {
            const newVnode = newChildren[index]
            mountElement(newVnode, el)
          }
        }

        if (oldChildren.length > length) {
          // 删除节点
          for (let index = length; index < oldChildren.length; index++) {
            const oldVnode = oldChildren[index]
            oldVnode.el.parent.removeChild(oldVnode.el)
          }
        }
      }
    }
  }

}


export function mountElement(vnode, container) {
  // vnode : 虚拟节点
  // container : 容器

  // 解构 
  const { tag, props, children } = vnode

  // 1. 创建真实节点
  const el = (vnode.el = document.createElement(tag))

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
