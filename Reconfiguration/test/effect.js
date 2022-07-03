

let currentEffect

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



// let dep = new Dep(10)
// let b
// effectWatch(() => {
//   b = dep.value + 10
//   console.log(b)
// })

// dep.value = 20


module.exports = {
  effectWatch,
  Dep
}
