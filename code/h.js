

// 创建一个 虚拟DOM  ->  VDOM   |  VNode 

// 虚拟节点的本质就是一个对象


export function h (tag, props, children) { // 标签  属性  子节点
  
  // 返回虚拟节点
  return {
    tag,
    props,
    children
  }
}
