const { Dep } = require('./effect.js')


const targetMap = new Map();

function getDep(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Dep()
    depsMap.set(key, dep)
  }
  return dep
}


function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      // 收集依赖
      let dep = getDep(target, key)
      dep.depend()
      return Reflect.get(target, key)
    },

    set(target, key, value) {
      let dep = getDep(target, key)
      let result = Reflect.set(target, key, value)
      dep.notice()
      // 触发依赖
      return result
    }
  })
}

module.exports = {
  reactive
}


// // 代理对象
// const user = reactive({
//   age: 10
// })
// let doubel
// effectWatch(() => {
//   doubel = user.age + 10
//   console.log(doubel)
// })
// // 修改数据
// user.age = 20
// user.age++
