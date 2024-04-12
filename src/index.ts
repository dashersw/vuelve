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
  WatchCallback,
  WatchSource,
  WatchEffect,
  ComputedRef,
  UnwrapRef,
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
type IndexableMethods = Record<string, (...methodArgs: any[]) => any>

export type Composable<P extends object, D extends object, M extends IndexableMethods, C extends object> = {
  [K in keyof typeof vue3LifecycleHooks]?: (...args: any[]) => any
} & {
  props?: Array<keyof P>
  data?: D
  methods?: M
  computed?: C
  watch?: Record<string, WatchCallback<readonly (object | WatchSource<unknown>)[]>>
  watchEffect?: Record<string, WatchEffect>
} & ThisType<
    P &
      M &
      {
        [K in keyof D]: Ref<UnwrapRef<D[K]>>
      } &
      { [K in keyof C]: ComputedRef<C[K]> }
  >

export default function vuelve<P extends object, D extends object, M extends IndexableMethods, C extends object>(
  composable: Composable<P, D, M, C>
): (
  ...args: any[]
) => P &
  {
    [K in keyof D]: Ref<UnwrapRef<D[K]>>
  } &
  M &
  { [K in keyof C]: ComputedRef<C[K]> } {
  return function setup(...args: any[]) {
    const props: P = {} as P
    const data: Partial<{ [K in keyof D]: Ref<UnwrapRef<D[K]>> }> = {}
    const methods: M = {} as M
    const computeds: Partial<{ [K in keyof C]: ComputedRef<C[K]> }> = {}

    const context = {} as P &
      {
        [K in keyof D]: Ref<UnwrapRef<D[K]>>
      } &
      M &
      { [K in keyof C]: ComputedRef<C[K]> }

    args.forEach((arg, i) => {
      const propName = composable.props?.[i]

      if (typeof propName === 'string') {
        props[propName as keyof P] = arg
      }
    })
    Object.assign(context, props)
    if (composable.data) {
      Object.entries(composable.data).forEach(([key, value]) => {
        data[key as keyof D] = ref(cloneDeep(value)) as Ref<UnwrapRef<D[keyof D]>>
      })
    }
    
    Object.assign(context, data)
    if (composable.methods) {
      Object.entries(composable.methods).forEach(([key, value]) => {
        methods[key as keyof M] = ((...methodArgs: any[]) =>
          (value as (...methodArgs: any[]) => any).apply(context, methodArgs)) as M[keyof M]
      })
    }

    Object.assign(context, methods)
    Object.entries(vue3LifecycleHooks).forEach(([lifecycleHookName, vue3LifecycleHook]) => {
      const lifecycleHookNameKey = lifecycleHookName as keyof Composable<P, D, M, C>

      if (composable[lifecycleHookNameKey]) {
        const composableFunction = composable[lifecycleHookNameKey] as Function
        vue3LifecycleHook((...lifecycleArgs: any[]) => composableFunction.apply(context, lifecycleArgs))
      }
    })

    if (composable.watch) {
      Object.entries(composable.watch).forEach(([key, value]) => {
        if (data[key as keyof D]) {
          watch(data[key as keyof D] as any, value)
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
        const composableComputedFunction = composable.computed?.[key as keyof C]
        if (composableComputedFunction) {
          computeds[key as keyof C] = computed((composableComputedFunction as () => any).bind(context))
        }
      })
    }
    Object.assign(context, computeds)
    return context
  }
}
