import { ref, onMounted, watch, computed, watchEffect } from 'vue'
import cloneDeep from 'lodash.clonedeep'

export default function vuelve(composable, obj) {
  let localObj = obj
  let localComposable = composable

  if (!localObj && !localComposable.returns) {
    localObj = localComposable
    localComposable = localComposable.default
  } else {
    localObj = localObj || localComposable.returns
  }

  const exports = Object.keys(localObj)

  const variables = {}
  const methods = {}
  const computeds = {}

  return function setup(...args) {
    args.forEach((arg, i) => {
      variables[localComposable.props[i]] = arg
    })

    Object.keys(localObj).forEach(key => {
      if (key == 'default') return

      // bind context variables to methods
      if (typeof localObj[key] === 'function') {
        methods[key] = localObj[key].bind(variables)
      }
      // clone data variables
      else variables[key] = ref(cloneDeep(localObj[key]))
    })

    if (localComposable.mounted) {
      onMounted(methods[localComposable.mounted.name])
    }

    if (localComposable.watch) {
      Object.entries(localComposable.watch).forEach(([key, value]) => {
        watch(variables[key], methods[value.name])
      })
    }

    if (localComposable.watchEffect) {
      Object.values(localComposable.watchEffect).forEach(value => {
        watchEffect(methods[value.name])
      })
    }

    if (localComposable.computed) {
      Object.keys(localComposable.computed).forEach(key => {
        computeds[key] = computed(methods[key])
      })
    }

    const returns = {}

    exports.forEach(key => {
      if (key == 'default') return

      if (key in variables) returns[key] = variables[key]
      if (key in methods) returns[key] = methods[key]
      if (key in computeds) returns[key] = computeds[key]
    })

    return returns
  }
}
