import {
  ref,
  watch,
  computed,
  watchEffect,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
  onRenderTracked,
  onRenderTriggered,
  onActivated,
  onDeactivated,
  onServerPrefetch,
} from 'vue'
import cloneDeep from 'lodash.clonedeep'

const vue3LifecycleHooks = {
  mounted: onMounted,
  beforeUpdate: onBeforeUpdate,
  updated: onUpdated,
  beforeUnmount: onBeforeUnmount,
  unmounted: onUnmounted,
  errorCaptured: onErrorCaptured,
  renderTracked: onRenderTracked,
  renderTriggered: onRenderTriggered,
  activated: onActivated,
  deactivated: onDeactivated,
  serverPrefetch: onServerPrefetch,
}

export default function vuelve(composable) {
  return function setup(...args) {
    const variables = {}
    const methods = {}
    const computeds = {}

    const context = {}
    args.forEach((arg, i) => {
      variables[composable.props[i]] = arg
    })

    Object.keys(composable.data || {}).forEach(key => {
      variables[key] = ref(cloneDeep(composable.data[key]))
    })

    Object.assign(context, variables)

    if (composable.methods)
      Object.keys(composable.methods).forEach(key => {
        methods[key] = (...methodArgs) => composable.methods[key].apply(context, methodArgs)
      })

    Object.assign(context, methods)

    Object.keys(vue3LifecycleHooks).forEach(lifecycleHook => {
      if (composable[lifecycleHook]) {
        const vue3LifecycleHook = vue3LifecycleHooks[lifecycleHook]

        if (vue3LifecycleHook && composable[composable[lifecycleHook].name]) {
          vue3LifecycleHook((...lifecycleArgs) =>
            composable[composable[lifecycleHook].name].apply(context, lifecycleArgs)
          )
        }
      }
    })

    if (composable.watch) {
      Object.entries(composable.watch).forEach(([key, value]) => {
        watch(variables[key], value)
      })
    }

    if (composable.watchEffect) {
      Object.values(composable.watchEffect).forEach(value => {
        watchEffect(value.bind(context))
      })
    }

    if (composable.computed) {
      Object.keys(composable.computed).forEach(key => {
        computeds[key] = computed(composable.computed[key].bind(context))
      })
    }

    return {
      ...variables,
      ...methods,
      ...computeds,
    }
  }
}
