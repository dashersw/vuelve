/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  onActivated,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onRenderTracked,
  onRenderTriggered,
  onServerPrefetch,
  onUnmounted,
  onUpdated,
} from 'vue'
import { ComposableContext } from './types-handling.ts'

export const vue3LifecycleHooks = {
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

export type ComposableLifecycleHook<Props, Data, Computed, Methods> = {
  [K in keyof typeof vue3LifecycleHooks]?:
    | typeof vue3LifecycleHooks[K]
    | ((this: ComposableContext<Props, Data, Computed, Methods>, ...args: any[]) => any)
}
