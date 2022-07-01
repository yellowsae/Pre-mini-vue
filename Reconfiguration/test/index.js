
let currentEffect = null

class Dep {
  constructor(val) {
    this._val = val
    this.effects = new Set()
  }

  get value() {
    this.depend()
    return this._val
  }

  set value(val) {
    this._val = val
    this.notice()
  }

  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect)
    }
  }

  notice() {
    this.effects.forEach(effect => effect())
  }
}

function effectWatch(effect) {
  currentEffect = effect
  effect()
  currentEffect = null
}



const targetMap = new WeakMap()

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
      let dep = getDep(target, key)
      dep.depend()   // get 时候 收集依赖 
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      let dep = getDep(target, key)
      let result = Reflect.set(target, key, value)
      dep.notice()  // 触发依赖
      return result
    },
  })
}


const user = reactive({
  age: 10
})
let result
effectWatch(() => {
  result = user.age + 10
  console.log(result)
})

user.age = 20
