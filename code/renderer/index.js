

// diff 算法的逻辑 
// n1  oldVnode
// n2  newVnode
export function diff(n1, n2) {

  console.log(n1, n2)

  // 1. tag   对比 tag 标签
  if (n1.tag !== n2.tag) { // 如果 n1 与 n2 的节点不一样，那么就需要更新
    // 把 n1 节点换成 n2 的节点
    n1.el.replaceWith(document.createElement(n2.tag))

  } else {   // 当标签没有发生改变时候

    // 需要把 n1.el 赋值给 n2.el, 当更新节点时候， n2 节点就变成了 n1 了，然后n2 里面必须要有 el
    const el = (n2.el = n1.el)  // 小细节

    // 2. props
    // 2.1:  数据发生变化  new : {id: 'foo', class: 'bar'}
    //      old : {id: 'foo', class: 'bar1'}

    // 2.2: 数据添加或删除   new : {id: 'foo', class: 'bar', a}
    //      old : {id: 'foo', class: 'bar1', a, b}

    const { props: newProps } = n2
    const { props: oldProps } = n1

    if (newProps && oldProps) { // 判断不为空时
      // 循环 新的节点 属性
      Object.keys(newProps).forEach(key => {
        const newVal = newProps[key]
        const oldVal = oldProps[key]

        // 进行对比 
        if (newVal !== oldVal) {
          // 修改节点属性
          el.setAttribute(key, newVal)
        }
      })
    }

    if (oldProps) { // 执行2.2 删除 
      // 循环老的节点
      Object.keys(oldProps).forEach(key => {
        // const newVal = newProps[key]
        // const oldVal = oldProps[key]

        // 如果 新的节点 没有 老节点的key 
        if (!newProps[key]) {
          // 执行删除老节点的 key 
          el.removeAttribute(key)
        }
      })
    }


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




// mountElement() , 将虚拟DOM 转为 真实DOM，并添加到 容器中

// 把虚拟DOM 转为 真实DOM,  本质也就是 初始化 Element 的一个过程
export function mountElement(vnode, container) {
  // vnode 虚拟节点  
  // container 容器

  const { tag, props, children } = vnode
  // tag   设置节点
  const el = (vnode.el = document.createElement(tag))
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
