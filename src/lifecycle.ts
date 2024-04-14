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
} as const

type HookNames = keyof typeof vue3LifecycleHooks

export type ComposableLifecycleHook = {
  [K in HookNames]?: (...args: any[]) => void
}
