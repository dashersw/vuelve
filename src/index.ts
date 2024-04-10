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
  ComputedGetter,
  WatchCallback,
  WatchSource,
  WatchEffect,
  ComputedRef,
  Ref,
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

export type Composable = {
  // get type of vue lifecycle hooks with user arguments generic
  [key in keyof typeof vue3LifecycleHooks]?: (typeof vue3LifecycleHooks)[key] extends (fn: infer U) => void ? U : never
} & {
  props?: string[]
  computed?: Record<string, ComputedGetter<unknown>>
  watch?: Record<string, WatchCallback<readonly (object | WatchSource<unknown>)[]>>
  watchEffect?: Record<string, WatchEffect>
  returns?: Record<string, unknown>
  default?: Composable
}

type ExtractReturnType<T extends Composable, U = void> = U extends void
  ? T['returns'] extends object
    ? T['returns']
    : T
  : U

export default function vuelve<T extends Composable, U = void>(composable: T, obj?: U) {
  const localObj = obj ?? composable.returns ?? composable
  const localComposable = obj ? composable : composable.default ?? composable

  const exports = Object.keys(localObj)

  const variables: Record<string, Ref> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methods: Record<string, () => any> = {}
  const computeds: Record<string, ComputedRef> = {}

  return function setup<V extends Ref[]>(...args: V) {
    args.forEach((arg, i) => {
      if (localComposable.props) {
        variables[localComposable.props[i]] = arg
      }
    })

    Object.entries(localObj).forEach(([key, value]) => {
      if (key == 'default') return

      // bind context variables to methods
      if (typeof value === 'function') {
        methods[key] = value.bind(variables)
      }
      // clone data variables
      else variables[key] = ref(cloneDeep(value))
    })

    Object.entries(vue3LifecycleHooks).forEach(([lifecycleHook, vueHookMethod]) => {
      const vue3LifecycleHookName = lifecycleHook as keyof typeof vue3LifecycleHooks
      const hasLocalComposableLifecycleHook = localComposable[vue3LifecycleHookName]

      if (hasLocalComposableLifecycleHook) {
        const lifecycleMethodName = localComposable[vue3LifecycleHookName]?.name

        if (!lifecycleMethodName) return

        if (vueHookMethod && methods[lifecycleMethodName]) {
          vueHookMethod(methods[lifecycleMethodName])
        }
      }
    })

    if (localComposable.watch) {
      Object.entries(localComposable.watch).forEach(([key, value]) => {
        if (!variables[key]) return
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

    const returns = {} as Record<string, Ref | ComputedRef | (() => unknown)>
    exports.forEach(key => {
      if (key == 'default') return

      if (key in variables) returns[key] = variables[key]
      if (key in methods) returns[key] = methods[key]
      if (key in computeds) returns[key] = computeds[key]
    })

    return returns as ExtractReturnType<T, U>
  }
}
