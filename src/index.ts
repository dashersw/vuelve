/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
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
  [K in keyof typeof vue3LifecycleHooks]?: (this: Composable, ...args: any[]) => any
} & {
  props?: string[]
  data?: Record<string, unknown>
  methods?: Record<string, (...args: any[]) => any>
  computed?: Record<string, ComputedGetter<unknown>>
  watch?: Record<string, WatchCallback<readonly (object | WatchSource<unknown>)[]>>
  watchEffect?: Record<string, WatchEffect>
}

type ComposableReturn<T extends Composable> = {
  [P in keyof T['data']]?: Ref<T['data'][P]>
} &
  {
    [P in keyof T['methods']]: T['methods'][P]
  } &
  {
    [P in keyof T['computed']]: ComputedRef<(...args: any[]) => any>
  }

export default function vuelve<T extends Composable>(composable: T): (...args: any[]) => ComposableReturn<T> {
  return function setup(...args: any[]) {
    const variables = {} as Record<string, unknown>
    const methods = {} as Record<string, () => unknown>
    const computeds = {} as Record<string, ComputedRef<unknown>>

    const context = {}

    args.forEach((arg, i) => {
      const propName = composable.props?.[i]

      if (propName) {
        variables[propName] = arg
      }
    })

    if (composable.data) {
      Object.entries(composable.data).forEach(([key, value]) => {
        variables[key] = ref(cloneDeep(value))
      })
    }

    Object.assign(context, variables)

    if (composable.methods) {
      Object.entries(composable.methods).forEach(([key, value]) => {
        methods[key] = (...methodArgs: any[]) => value.apply(context, methodArgs)
      })
    }

    Object.assign(context, methods)

    Object.entries(vue3LifecycleHooks).forEach(([lifecycleHookName, vue3LifecycleHook]) => {
      const lifecycleHookNameKey = lifecycleHookName as keyof Composable

      if (composable[lifecycleHookNameKey]) {
        const composableFunction = composable[lifecycleHookNameKey] as Function
        vue3LifecycleHook((...lifecycleArgs: any[]) => composableFunction.apply(context, lifecycleArgs))
      }
    })

    if (composable.watch) {
      Object.entries(composable.watch).forEach(([key, value]) => {
        if (variables[key]) {
          watch(variables[key] as readonly (object | WatchSource<unknown>)[], value)
        }
      })
    }

    if (composable.watchEffect) {
      Object.values(composable.watchEffect).forEach(value => {
        watchEffect(value.bind(context))
      })
    }

    if (composable.computed) {
      Object.keys(composable.computed).forEach(key => {
        const composableComputedFunction = composable.computed?.[key]
        if (composableComputedFunction) {
          computeds[key] = computed(composableComputedFunction.bind(context))
        }
      })
    }
    return {
      ...variables,
      ...methods,
      ...computeds,
    } as ComposableReturn<T>
  }
}
