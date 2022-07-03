

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

export function effectWatch(effect) {
  currentEffect = effect
  effect()
  currentEffect = null
}

let targetMap = new Map()

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

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      let dep = getDep(target, key)
      dep.depend()
      return Reflect.get(target, key)
    },

    set(target, key, value) {
      let dep = getDep(target, key)
      let result = Reflect.set(target, key, value)
      dep.notice()
      return result
    }
  })
}


// ES6 模块引入
